import { Controller } from "@application/contracts/controller.contract";
import { Profile } from "@application/entities/profile.entity";
import { GetMeUseCase } from "@application/usecases/accounts/get-me.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class GetMeController extends Controller<"private", GetMeController.Response> {
  constructor(private readonly getMeUseCase: GetMeUseCase) {
    super();
  }

  protected override async handle({
    accountId,
  }: Controller.HttpRequest<"private">): Promise<Controller.HttpResponse<GetMeController.Response>> {
    const { goal, profile } = await this.getMeUseCase.execute({ accountId });
    return { statusCode: 200, body: { goal, profile } };
  }
}

export namespace GetMeController {
  export type Response = {
    profile: {
      name: string;
      birthDate: string;
      gender: Profile.Gender;
      weight: number;
      height: number;
    };

    goal: {
      calories: number;
      proteins: number;
      carbohydrates: number;
      fats: number;
    };
  };
}
