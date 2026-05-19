import { Account } from "@application/entities/account.entity";
import { Goal } from "@application/entities/goal.entity";
import { Profile } from "@application/entities/profile.entity";
import { EmailAlreadyExists } from "@application/errors/application/email-already-exists.error";
import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { GoalRepository } from "@infra/database/dynamo/repositories/goal.repository";
import { ProfileRepository } from "@infra/database/dynamo/repositories/profile.repository";
import { AuthGateway } from "@infra/gateways/auth.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly goalRepository: GoalRepository,
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

    // enviamos a entidade pura da aplicacao para o repositorio
    // ele que transforma a entidade num formato compativel com as interfaces do dynamo
    await Promise.all([
      this.accountRepository.save(account),
      this.profileRepository.save(profile),
      this.goalRepository.save(goal),
    ]);

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
