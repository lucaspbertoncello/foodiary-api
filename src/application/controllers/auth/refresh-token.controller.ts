import { Controller } from "@application/contracts/controller.contract";
import { RefreshTokenUseCase } from "@application/usecases/auth/refresh-token.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { RefreshTokenBody, refreshTokenSchema } from "./_schemas/refresh-token.schema";

@Injectable()
@Schema({ body: refreshTokenSchema })
export class RefreshTokenController extends Controller<
  "public",
  RefreshTokenController.Response,
  RefreshTokenController.Body,
  RefreshTokenController.Headers,
  RefreshTokenController.Params,
  RefreshTokenController.QueryParams
> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
    super();
  }

  protected override async handle({
    body,
  }: Controller.HttpRequest<
    "public",
    RefreshTokenController.Body,
    RefreshTokenController.Headers,
    RefreshTokenController.Params,
    RefreshTokenController.QueryParams
  >): Promise<
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
  export type Body = RefreshTokenBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = {
    accessToken: string;
    refreshToken: string;
  };
}
