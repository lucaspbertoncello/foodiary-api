import { Controller } from "@application/contracts/controller.contract";
import { ForgotPasswordUseCase } from "@application/usecases/auth/forgot-password.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { ForgotPasswordBody, forgotPasswordSchema } from "./_schemas/forgot-password.schema";

@Injectable()
@Schema(forgotPasswordSchema)
export class ForgotPasswordController extends Controller<
  "public",
  ForgotPasswordController.Response,
  ForgotPasswordController.Body,
  ForgotPasswordController.Headers,
  ForgotPasswordController.Params,
  ForgotPasswordController.QueryParams
> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<
    "public",
    ForgotPasswordController.Body,
    ForgotPasswordController.Headers,
    ForgotPasswordController.Params,
    ForgotPasswordController.QueryParams
  >): Promise<
    Controller.HttpResponse<ForgotPasswordController.Response>
  > {
    const { email } = body;
    await this.forgotPasswordUseCase.execute({ email });

    return {
      statusCode: 204,
    };
  }
}

export namespace ForgotPasswordController {
  export type Body = ForgotPasswordBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = void;
}
