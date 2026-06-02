import { ListMealsByDateController } from "@application/controllers/meals/list-meals-by-date.controller";
import { lambdaHttpAdapter } from "@main/adapters/lambda.adapter";

export const handler = lambdaHttpAdapter({ controllerImpl: ListMealsByDateController });
