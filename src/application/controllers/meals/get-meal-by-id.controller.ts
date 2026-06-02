import { Controller } from "@application/contracts/controller.contract";
import { Meal } from "@application/entities/meal.entity";
import { GetMealByIdUseCase } from "@application/usecases/meals/get-meal-by-id.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { getMealByIdSchema } from "./_schemas/get-meal-by-id.schema";

@Injectable()
export class GetMealById extends Controller<"private", GetMealById.Response> {
  constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: Controller.HttpRequest<"private">): Promise<Controller.HttpResponse<GetMealById.Response>> {
    const { mealId } = getMealByIdSchema.parse(params);
    const { meal } = await this.getMealByIdUseCase.execute({ accountId, mealId });
    return { statusCode: 200, body: { meal: { ...meal, createdAt: meal.createdAt.toISOString() } } };
  }
}

export namespace GetMealById {
  export type Response = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileKey: string;
      name: string;
      icons: string;
      foods: Meal.Food[];
      createdAt: string;
    };
  };
}
