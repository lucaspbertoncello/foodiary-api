import { SigninController } from "@application/controllers/auth/signin.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: SigninController });
