import { Controller } from "@application/contracts/controller.contract";
import { Meal } from "@application/entities/meal.entity";
import { GetMealByIdUseCase } from "@application/usecases/meals/get-meal-by-id.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { GetMealByIdParams, getMealByIdSchema } from "./_schemas/get-meal-by-id.schema";

@Injectable()
@Schema({ params: getMealByIdSchema })
export class GetMealById extends Controller<
  "private",
  GetMealById.Response,
  GetMealById.Body,
  GetMealById.Headers,
  GetMealById.Params,
  GetMealById.QueryParams
> {
  constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: Controller.HttpRequest<
    "private",
    GetMealById.Body,
    GetMealById.Headers,
    GetMealById.Params,
    GetMealById.QueryParams
  >): Promise<Controller.HttpResponse<GetMealById.Response>> {
    const { meal } = await this.getMealByIdUseCase.execute({ accountId, mealId: params.mealId });
    return { statusCode: 200, body: { meal: { ...meal, createdAt: meal.createdAt.toISOString() } } };
  }
}

export namespace GetMealById {
  export type Body = Record<string, unknown>;
  export type Headers = Record<string, unknown>;
  export type Params = GetMealByIdParams;
  export type QueryParams = Record<string, unknown>;

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
