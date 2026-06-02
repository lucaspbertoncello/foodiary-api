import { Controller } from "@application/contracts/controller.contract";
import { CreateMealUseCase } from "@application/usecases/meals/create-meal.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { CreateMealBody, createMealSchema } from "./_schemas/create-meal.schema";

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<
  "private",
  CreateMealController.Response,
  CreateMealController.Body,
  CreateMealController.Headers,
  CreateMealController.Params,
  CreateMealController.QueryParams
> {
  constructor(private readonly createMealUseCase: CreateMealUseCase) {
    super();
  }

  protected override async handle({
    body,
    accountId,
  }: Controller.HttpRequest<
    "private",
    CreateMealController.Body,
    CreateMealController.Headers,
    CreateMealController.Params,
    CreateMealController.QueryParams
  >): Promise<
    Controller.HttpResponse<CreateMealController.Response>
  > {
    const { file } = body;
    const { mealId, uploadSignature } = await this.createMealUseCase.execute({ accountId, file });

    return {
      statusCode: 200,
      body: { mealId, uploadSignature },
    };
  }
}

export namespace CreateMealController {
  export type Body = CreateMealBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = { mealId: string; uploadSignature: string };
}
