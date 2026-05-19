import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";
import { EmailAlreadyExists } from "@application/errors/application/email-already-exists.error";
import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { SignupUnitOfWork } from "@infra/database/dynamo/uow/signup.uow";
import { AuthGateway } from "@infra/gateways/auth.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly signupUnitOfWork: SignupUnitOfWork,
  ) {}

  public async execute({
    accountInfo: { email, password },
    profileInfo,
  }: SignupUseCase.Input): Promise<SignupUseCase.Output> {
    const emailAlreadyInUse = await this.accountRepository.findByEmail({ email });

    if (emailAlreadyInUse) {
      throw new EmailAlreadyExists({});
    }

    const account = new Account({ email });
    const profile = new Profile({ ...profileInfo, accountId: account.id });
    const goal = new Goal({
      accountId: account.id,
      calories: 2500,
      proteins: 180,
      fats: 80,
      carbohydrates: 500,
    });

    const { externalId } = await this.authGateway.signup({ email, password, internalId: account.id });
    account.externalId = externalId;

    await this.signupUnitOfWork.run({ account, goal, profile });
    const { accessToken, refreshToken } = await this.authGateway.signin({ email, password });

    return { accessToken, refreshToken };
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
    };
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
