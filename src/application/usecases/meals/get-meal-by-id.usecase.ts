import { Meal } from "@application/entities/meal.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class GetMealByIdUseCase {
  constructor(private readonly mealsRepository: MealRepository) {}

  public async execute({ mealId, accountId }: GetMealById.Input): Promise<GetMealById.Output> {
    const meal = await this.mealsRepository.findById({ mealId, accountId });

    if (!meal) {
      throw new ResourceNotFound({ message: "Meal not found." });
    }

    return {
      meal: {
        createdAt: meal.createdAt,
        foods: meal.foods,
        icons: meal.icons,
        id: meal.id,
        inputFileKey: meal.inputFileKey,
        inputType: meal.inputType,
        name: meal.name,
        status: meal.status,
      },
    };
  }
}

export namespace GetMealById {
  export type Input = { mealId: string; accountId: string };

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileKey: string;
      name: string;
      icons: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}
