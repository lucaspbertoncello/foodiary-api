import { Controller } from "@application/contracts/controller.contract";
import { Meal } from "@application/entities/meal.entity";
import { ListMealsByDateQuery } from "@application/queries/list-meals-by-date.query";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { listMealsByDateSchema } from "./_schemas/list-meals-by-date.schema";

@Injectable()
export class ListMealsByDateController extends Controller<"private", ListMealsByDateController.Response> {
  constructor(private readonly listMealsByDateQuery: ListMealsByDateQuery) {
    super();
  }

  protected override async handle({
    queryParams,
    accountId,
  }: Controller.HttpRequest<"private">): Promise<
    Controller.HttpResponse<ListMealsByDateController.Response>
  > {
    const { date } = listMealsByDateSchema.parse(queryParams);
    const { meals } = await this.listMealsByDateQuery.execute({ accountId, date });

    return {
      statusCode: 200,
      body: { meals },
    };
  }
}

export namespace ListMealsByDateController {
  export type Response = {
    meals: {
      id: string;
      createdAt: string;
      name: string;
      icons: string;
      foods: Meal.Food[];
    }[];
  };
}
