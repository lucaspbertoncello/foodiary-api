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
  ResetPasswordBody
> {
  constructor(private readonly resetPasswordUseCase: ResetPasswordUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<"public", ResetPasswordBody>): Promise<
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
  export type Response = void;
}
