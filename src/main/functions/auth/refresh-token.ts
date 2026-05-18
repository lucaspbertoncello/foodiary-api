import { RefreshTokenController } from "@application/controllers/auth/refresh-token.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: RefreshTokenController });
