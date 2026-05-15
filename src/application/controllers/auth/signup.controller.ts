import { Controller } from "@application/contracts/controller.contract";
import { SignupUsecase } from "@application/usecases/auth/signup.usecase";
import { Schema } from "@kernel/decorators/schema.decorator";
import { SignupBody, signupSchema } from "./_schemas/signup.schema";

@Schema(signupSchema)
export class SignupController extends Controller<SignupController.Response> {
  constructor(private readonly signupUsecase: SignupUsecase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<SignupBody>): Promise<Controller.HttpResponse<SignupController.Response>> {
    const { email, password } = body.account;
    const { accessToken, refreshToken } = await this.signupUsecase.execute({ email, password });

    return {
      statusCode: 200,
      body: { accessToken, refreshToken },
    };
  }
}

export namespace SignupController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
