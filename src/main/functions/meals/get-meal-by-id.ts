import { GetMealById } from "@application/controllers/meals/get-meal-by-id.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: GetMealById });
