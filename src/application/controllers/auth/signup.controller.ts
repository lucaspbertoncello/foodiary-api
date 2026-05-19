import { Controller } from "@application/contracts/controller.contract";
import { SignupUseCase } from "@application/usecases/auth/signup.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { SignupBody, signupSchema } from "./_schemas/signup.schema";

@Injectable()
@Schema(signupSchema)
export class SignupController extends Controller<"public"> {
  constructor(private readonly signupUseCase: SignupUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<"public", SignupBody>): Promise<
    Controller.HttpResponse<SignupController.Response>
  > {
    const { email, password } = body.account;
    const { accessToken, refreshToken } = await this.signupUseCase.execute({ email, password });

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
