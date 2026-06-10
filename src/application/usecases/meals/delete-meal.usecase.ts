import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsStorageGateway } from "@infra/gateways/meals-storage.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class DeleteMealUseCase {
  constructor(
    private readonly mealRepository: MealRepository,
    private readonly mealsStorageGateway: MealsStorageGateway,
  ) {}

  public async execute({ accountId, mealId }: DeleteMealUseCase.Input): Promise<DeleteMealUseCase.Output> {
    const meal = await this.mealRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFound({ message: "Meal not found." });
    }

    await this.mealsStorageGateway.deleteFile({ inputFileKey: meal.inputFileKey });
    await this.mealRepository.delete({ accountId, mealId });
  }
}

export namespace DeleteMealUseCase {
  export type Input = { accountId: string; mealId: string };
  export type Output = void;
}
