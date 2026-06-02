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
  ForgotPasswordBody
> {
  constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<"public", ForgotPasswordBody>): Promise<
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
  export type Response = void;
}
