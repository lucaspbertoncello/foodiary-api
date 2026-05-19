import { Controller } from "@application/contracts/controller.contract";
import { RefreshTokenUseCase } from "@application/usecases/auth/refresh-token.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { RefreshTokenBody, refreshTokenSchema } from "./_schemas/refresh-token.schema";

@Injectable()
@Schema(refreshTokenSchema)
export class RefreshTokenController extends Controller<"public", RefreshTokenController.Response> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<"public", RefreshTokenBody>): Promise<
    Controller.HttpResponse<RefreshTokenController.Response>
  > {
    const { accessToken, refreshToken } = await this.refreshTokenUseCase.execute({
      refreshToken: body.refreshToken,
    });

    return {
      statusCode: 200,
      body: { accessToken, refreshToken },
    };
  }
}

export namespace RefreshTokenController {
  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
