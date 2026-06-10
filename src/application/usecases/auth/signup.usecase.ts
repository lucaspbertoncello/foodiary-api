import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";
import { EmailAlreadyExists } from "@application/errors/application/email-already-exists.error";
import { GoalCalculatorService } from "@application/services/goal-calculator.service";
import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { SignupUnitOfWork } from "@infra/database/dynamo/uow/signup.uow";
import { AuthGateway } from "@infra/gateways/auth.gateway";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Saga } from "@kernel/saga/saga";

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signupUnitOfWork: SignupUnitOfWork,
    private readonly saga: Saga,
    private readonly logger: ConsoleLogger,
  ) {}

  public async execute({
    accountInfo: { email, password },
    profileInfo,
  }: SignupUseCase.Input): Promise<SignupUseCase.Output> {
    return await this.saga.run<SignupUseCase.Output>(async () => {
      this.logger.debug({
        message: "Signup started",
        metadata: { service: "auth", operation: "signup" },
      });

      const emailAlreadyInUse = await this.accountRepository.findByEmail({ email });

      if (emailAlreadyInUse) {
        this.logger.warn({
          message: "Signup rejected because email already exists",
          metadata: { service: "auth", operation: "signup" },
        });

        throw new EmailAlreadyExists({});
      }

      const account = new Account({ email });
      const profile = new Profile({ ...profileInfo, accountId: account.id });

      const { calories, carbohydrates, fats, proteins } = GoalCalculatorService.calculate(profile);

      const goal = new Goal({
        accountId: account.id,
        calories,
        carbohydrates,
        fats,
        proteins,
      });

      const { externalId } = await this.authGateway.signup({ email, password, internalId: account.id });
      account.externalId = externalId;

      this.saga.addCompensation(() => this.authGateway.deleteUser({ externalId }));

      // atomicidade de operacoes do dynamo
      await this.signupUnitOfWork.run({ account, goal, profile });
      const { accessToken, refreshToken } = await this.authGateway.signin({ email, password });

      this.logger.info({
        message: "Signup completed",
        metadata: { service: "auth", operation: "signup", accountId: account.id },
      });

      return { accessToken, refreshToken };
    });
  }
}

export namespace SignupUseCase {
  export type Input = {
    accountInfo: { email: string; password: string };
    profileInfo: {
      name: string;
      birthDate: Date;
      activityLevel: Profile.ActivityLevel;
      gender: Profile.Gender;
      height: number;
      weight: number;
      goal: Profile.Goal;
    };
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
