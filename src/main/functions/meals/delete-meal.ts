import { DeleteMealController } from "@application/controllers/meals/delete-meal.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: DeleteMealController });
