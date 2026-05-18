import { UserNotFound } from "@application/errors/application/user-not-found.error";
import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { AuthGateway } from "@infra/gateways/auth.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class SigninUseCase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly authGateway: AuthGateway,
  ) {}

  public async execute({ email, password }: SigninUseCase.Input): Promise<SigninUseCase.Output> {
    const userExists = await this.accountRepository.findByEmail({ email });

    if (!userExists) {
      throw new UserNotFound({});
    }

    const { accessToken, refreshToken } = await this.authGateway.signin({ email, password });
    return { accessToken, refreshToken };
  }
}

export namespace SigninUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
