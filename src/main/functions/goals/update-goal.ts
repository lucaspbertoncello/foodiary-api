import { UpdateGoalController } from "@application/controllers/goals/update-goal.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: UpdateGoalController });
