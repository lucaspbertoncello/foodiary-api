import { Meal } from "@application/entities/meal.entity";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class CreateMealUseCase {
  constructor(private readonly mealsRepository: MealRepository) {}

  public async execute({ accountId, file }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    const inputType = file.type === "audio/m4a" ? Meal.InputType.AUDIO : Meal.InputType.PICTURE;

    const meal = new Meal({
      accountId,
      inputFileKey: "",
      inputType,
      status: Meal.Status.PENDING,
    });

    await this.mealsRepository.save(meal);

    return {
      mealId: meal.id,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = { accountId: string; file: { type: string; size: number } };
  export type Output = { mealId: string };
}
