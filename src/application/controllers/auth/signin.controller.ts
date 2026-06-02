import { Controller } from "@application/contracts/controller.contract";
import { SigninUseCase } from "@application/usecases/auth/signin.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { SigninBody, signinSchema } from "./_schemas/signin.schema";

@Injectable()
@Schema(signinSchema)
export class SigninController extends Controller<
  "public",
  SigninController.Response,
  SigninController.Body,
  SigninController.Headers,
  SigninController.Params,
  SigninController.QueryParams
> {
  constructor(private readonly signinUseCase: SigninUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<
    "public",
    SigninController.Body,
    SigninController.Headers,
    SigninController.Params,
    SigninController.QueryParams
  >): Promise<
    Controller.HttpResponse<SigninController.Response>
  > {
    const { email, password } = body.account;
    const { accessToken, refreshToken } = await this.signinUseCase.execute({ email, password });

    return { statusCode: 200, body: { accessToken, refreshToken } };
  }
}

export namespace SigninController {
  export type Body = SigninBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = { accessToken: string; refreshToken: string };
}
