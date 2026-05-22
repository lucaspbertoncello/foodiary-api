import { Profile } from "@application/entities/profile.entity";
import { GetGoalAndProfileQuery } from "@application/queries/get-goal-and-profile.query";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class GetMeUseCase {
  constructor(private readonly getGoalAndProfileQuery: GetGoalAndProfileQuery) {}

  public async execute({ accountId }: GetMeUseCase.Input): Promise<GetMeUseCase.Output> {
    const { goal, profile } = await this.getGoalAndProfileQuery.execute({ accountId });
    return { goal, profile };
  }
}

export namespace GetMeUseCase {
  export type Input = { accountId: string };
  export type Output = {
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
