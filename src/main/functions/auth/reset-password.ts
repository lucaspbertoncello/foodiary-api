import { ResetPasswordController } from "@application/controllers/auth/reset-password.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: ResetPasswordController });
