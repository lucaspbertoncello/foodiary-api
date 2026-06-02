import { Controller } from "@application/contracts/controller.contract";
import { SignupUseCase } from "@application/usecases/auth/signup.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { SignupBody, signupSchema } from "./_schemas/signup.schema";

@Injectable()
@Schema(signupSchema)
export class SignupController extends Controller<
  "public",
  SignupController.Response,
  SignupController.Body,
  SignupController.Headers,
  SignupController.Params,
  SignupController.QueryParams
> {
  constructor(private readonly signupUseCase: SignupUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<
    "public",
    SignupController.Body,
    SignupController.Headers,
    SignupController.Params,
    SignupController.QueryParams
  >): Promise<
    Controller.HttpResponse<SignupController.Response>
  > {
    const accountInfo = body.account;
    const profileInfo = body.profile;

    const { accessToken, refreshToken } = await this.signupUseCase.execute({
      accountInfo: { ...accountInfo },
      profileInfo: { ...profileInfo, birthDate: new Date(profileInfo.birthDate) },
    });

    return {
      statusCode: 200,
      body: { accessToken, refreshToken },
    };
  }
}

export namespace SignupController {
  export type Body = SignupBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
