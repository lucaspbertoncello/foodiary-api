import { CreateMealController } from "@application/controllers/meals/create-meal.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: CreateMealController });
