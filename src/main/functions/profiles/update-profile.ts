import { UpdateProfileController } from "@application/controllers/profiles/update-profile.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: UpdateProfileController });
