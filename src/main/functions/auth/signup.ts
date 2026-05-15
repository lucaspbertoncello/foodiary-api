import { SignupController } from "@application/controllers/auth/signup.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: SignupController });
