import { Controller } from "@application/contracts/controller.contract";
import { CreateMealUseCase } from "@application/usecases/meals/create-meal.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { CreateMealBody, createMealSchema } from "./_schemas/create-meal.schema";

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<"private", CreateMealController.Response> {
  constructor(private readonly createMealUseCase: CreateMealUseCase) {
    super();
  }

  protected override async handle({
    body,
    accountId,
  }: Controller.HttpRequest<"private", CreateMealBody>): Promise<
    Controller.HttpResponse<CreateMealController.Response>
  > {
    const { file } = body;
    await this.createMealUseCase.execute({ accountId, file });

    return {
      statusCode: 204,
    };
  }
}

export namespace CreateMealController {
  export type Response = void;
}
