import { Controller } from "@application/contracts/controller.contract";
import { Meal } from "@application/entities/meal.entity";
import { ListMealsByDateQuery } from "@application/queries/list-meals-by-date.query";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import {
  ListMealsByDateQueryParams,
  listMealsByDateSchema,
} from "./_schemas/list-meals-by-date.schema";

@Injectable()
@Schema({ queryParams: listMealsByDateSchema })
export class ListMealsByDateController extends Controller<
  "private",
  ListMealsByDateController.Response,
  ListMealsByDateController.Body,
  ListMealsByDateController.Headers,
  ListMealsByDateController.Params,
  ListMealsByDateController.QueryParams
> {
  constructor(private readonly listMealsByDateQuery: ListMealsByDateQuery) {
    super();
  }

  protected override async handle({
    queryParams,
    accountId,
  }: Controller.HttpRequest<
    "private",
    ListMealsByDateController.Body,
    ListMealsByDateController.Headers,
    ListMealsByDateController.Params,
    ListMealsByDateController.QueryParams
  >): Promise<
    Controller.HttpResponse<ListMealsByDateController.Response>
  > {
    const { meals } = await this.listMealsByDateQuery.execute({ accountId, date: queryParams.date });

    return {
      statusCode: 200,
      body: { meals },
    };
  }
}

export namespace ListMealsByDateController {
  export type Body = Record<string, unknown>;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = ListMealsByDateQueryParams;

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
