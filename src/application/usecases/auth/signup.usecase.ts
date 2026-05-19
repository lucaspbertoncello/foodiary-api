import { Account } from "@application/entities/account.entity";
import { EmailAlreadyExists } from "@application/errors/application/email-already-exists.error";
import { AccountRepository } from "@infra/database/dynamo/repositories/account.repository";
import { AuthGateway } from "@infra/gateways/auth.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class SignupUseCase {
  constructor(
    private readonly authGateway: AuthGateway,
    private readonly accountRepository: AccountRepository,
  ) {}

  public async execute({ email, password }: SignupUseCase.Input): Promise<SignupUseCase.Output> {
    const emailAlreadyInUse = await this.accountRepository.findByEmail({ email });

    if (emailAlreadyInUse) {
      throw new EmailAlreadyExists({});
    }

    const account = new Account({ email });
    const { externalId } = await this.authGateway.signup({ email, password, internalId: account.id });

    account.externalId = externalId;

    // enviamos a entidade pura da aplicacao para o repositorio
    // ele que transforma a entidade num formato compativel com as interfaces do dynamo
    await this.accountRepository.save(account);

    const { accessToken, refreshToken } = await this.authGateway.signin({ email, password });

    return { accessToken, refreshToken };
  }
}

export namespace SignupUseCase {
  export type Input = {
    email: string;
    password: string;
  };

  export type Output = {
    accessToken: string;
    refreshToken: string;
  };
}
