import { Controller } from "@application/contracts/controller.contract";
import { SigninUseCase } from "@application/usecases/auth/signin.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { SigninBody, signinSchema } from "./_schemas/signin.schema";

@Injectable()
@Schema(signinSchema)
export class SigninController extends Controller<SigninController.Response> {
  constructor(private readonly signinUsecase: SigninUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<SigninBody>): Promise<Controller.HttpResponse<SigninController.Response>> {
    const { email, password } = body.account;
    const { accessToken, refreshToken } = await this.signinUsecase.execute({ email, password });

    return { statusCode: 200, body: { accessToken, refreshToken } };
  }
}

export namespace SigninController {
  export type Response = { accessToken: string; refreshToken: string };
}
