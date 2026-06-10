import { Meal } from "@application/entities/meal.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsStorageGateway } from "@infra/gateways/meals-storage.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class GetMealByIdUseCase {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsStorageGateway: MealsStorageGateway,
  ) {}

  public async execute({ mealId, accountId }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
    const meal = await this.mealsRepository.findById({ mealId, accountId });

    if (!meal) {
      throw new ResourceNotFound({ message: "Meal not found." });
    }

    console.log(meal.inputFileKey);
    const inputFileUrl = this.mealsStorageGateway.getFileUrl({ inputFileKey: meal.inputFileKey });

    return {
      meal: {
        createdAt: meal.createdAt,
        foods: meal.foods,
        icons: meal.icons,
        id: meal.id,
        inputFileUrl,
        inputType: meal.inputType,
        name: meal.name,
        status: meal.status,
      },
    };
  }
}

export namespace GetMealByIdUseCase {
  export type Input = { mealId: string; accountId: string };

  export type Output = {
    meal: {
      id: string;
      status: Meal.Status;
      inputType: Meal.InputType;
      inputFileUrl: string;
      name: string;
      icons: string;
      foods: Meal.Food[];
      createdAt: Date;
    };
  };
}
