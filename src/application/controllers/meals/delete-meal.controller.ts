import { Controller } from "@application/contracts/controller.contract";
import { DeleteMealUseCase } from "@application/usecases/meals/delete-meal.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { DeleteMealParams, deleteMealSchema } from "./_schemas/delete-meal.schema";

@Injectable()
@Schema({ params: deleteMealSchema })
export class DeleteMealController extends Controller<
  "private",
  DeleteMealController.Response,
  DeleteMealController.Body,
  DeleteMealController.Headers,
  DeleteMealController.Params,
  DeleteMealController.QueryParams
> {
  constructor(private readonly deleteMealUseCase: DeleteMealUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    params,
  }: Controller.HttpRequest<
    "private",
    DeleteMealController.Body,
    DeleteMealController.Headers,
    DeleteMealController.Params,
    DeleteMealController.QueryParams
  >): Promise<Controller.HttpResponse<DeleteMealController.Response>> {
    await this.deleteMealUseCase.execute({ accountId, mealId: params.mealId });

    return { statusCode: 204 };
  }
}

export namespace DeleteMealController {
  export type Body = Record<string, unknown>;
  export type Headers = Record<string, unknown>;
  export type Params = DeleteMealParams;
  export type QueryParams = Record<string, unknown>;

  export type Response = void;
}
