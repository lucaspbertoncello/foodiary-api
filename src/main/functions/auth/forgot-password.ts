import { ForgotPasswordController } from "@application/controllers/auth/forgot-password.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: ForgotPasswordController });
