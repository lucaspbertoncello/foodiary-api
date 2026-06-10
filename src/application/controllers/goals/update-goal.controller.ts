import { Controller } from "@application/contracts/controller.contract";
import { UpdateGoalUseCase } from "@application/usecases/goals/update-goal.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { UpdateGoalBody, updateGoalSchema } from "./_schemas/update-goal.schema";

@Injectable()
@Schema({ body: updateGoalSchema })
export class UpdateGoalController extends Controller<
  "private",
  UpdateGoalController.Response,
  UpdateGoalController.Body,
  UpdateGoalController.Headers,
  UpdateGoalController.Params,
  UpdateGoalController.QueryParams
> {
  constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.HttpRequest<
    "private",
    UpdateGoalController.Body,
    UpdateGoalController.Headers,
    UpdateGoalController.Params,
    UpdateGoalController.QueryParams
  >): Promise<Controller.HttpResponse<UpdateGoalController.Response>> {
    await this.updateGoalUseCase.execute({ accountId, ...body });

    return { statusCode: 204 };
  }
}

export namespace UpdateGoalController {
  export type Body = UpdateGoalBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = void;
}
