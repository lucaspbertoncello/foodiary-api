import { AuthGateway } from "@infra/gateways/auth.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authGateway: AuthGateway) {}

  public async execute({
    code,
    email,
    newPassword,
  }: ResetPasswordUseCase.Input): Promise<ResetPasswordUseCase.Output> {
    await this.authGateway.resetPassword({ code, email, newPassword });
  }
}

export namespace ResetPasswordUseCase {
  export type Input = { email: string; code: string; newPassword: string };
  export type Output = void;
}
