import { GetMeController } from "@application/controllers/accounts/get-me.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: GetMeController });
