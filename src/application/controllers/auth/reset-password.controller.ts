import { Controller } from "@application/contracts/controller.contract";
import { ResetPasswordUseCase } from "@application/usecases/auth/reset-password.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { ResetPasswordBody, resetPasswordSchema } from "./_schemas/reset-password.schema";

@Injectable()
@Schema(resetPasswordSchema)
export class ResetPasswordController extends Controller<
  "public",
  ResetPasswordController.Response,
  ResetPasswordController.Body,
  ResetPasswordController.Headers,
  ResetPasswordController.Params,
  ResetPasswordController.QueryParams
> {
  constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<
    "public",
    ResetPasswordController.Body,
    ResetPasswordController.Headers,
    ResetPasswordController.Params,
    ResetPasswordController.QueryParams
  >): Promise<
    Controller.HttpResponse<ResetPasswordController.Response>
  > {
    const { code, email, newPassword } = body;

    await this.resetPasswordUseCase.execute({
      code,
      email,
      newPassword,
    });

    return {
      statusCode: 204,
    };
  }
}

export namespace ResetPasswordController {
  export type Body = ResetPasswordBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = void;
}
