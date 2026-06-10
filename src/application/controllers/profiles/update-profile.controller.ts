import { Controller } from "@application/contracts/controller.contract";
import { UpdateProfileUseCase } from "@application/usecases/profiles/update-profile.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { Schema } from "@kernel/decorators/schema.decorator";
import { UpdateProfileBody, updateProfileSchema } from "./_schemas/update-profile.schema";

@Injectable()
@Schema({ body: updateProfileSchema })
export class UpdateProfileController extends Controller<
  "private",
  UpdateProfileController.Response,
  UpdateProfileController.Body,
  UpdateProfileController.Headers,
  UpdateProfileController.Params,
  UpdateProfileController.QueryParams
> {
  constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {
    super();
  }

  protected override async handle({
    accountId,
    body,
  }: Controller.HttpRequest<
    "private",
    UpdateProfileController.Body,
    UpdateProfileController.Headers,
    UpdateProfileController.Params,
    UpdateProfileController.QueryParams
  >): Promise<Controller.HttpResponse<UpdateProfileController.Response>> {
    await this.updateProfileUseCase.execute({
      accountId,
      ...body,
      birthDate: new Date(body.birthDate),
    });

    return { statusCode: 204 };
  }
}

export namespace UpdateProfileController {
  export type Body = UpdateProfileBody;
  export type Headers = Record<string, unknown>;
  export type Params = Record<string, unknown>;
  export type QueryParams = Record<string, unknown>;

  export type Response = void;
}
