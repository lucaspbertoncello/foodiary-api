import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { GoalRepository } from "@infra/database/dynamo/repositories/goal.repository";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class UpdateGoalUseCase {
  constructor(private readonly goalRepository: GoalRepository) {}

  public async execute({
    accountId,
    calories,
    carbohydrates,
    fats,
    proteins,
  }: UpdateGoalUseCase.Input): Promise<UpdateGoalUseCase.Output> {
    const goal = await this.goalRepository.findByAccountId({ accountId });

    if (!goal) {
      throw new ResourceNotFound({ message: "Goal not found" });
    }

    goal.calories = calories;
    goal.carbohydrates = carbohydrates;
    goal.proteins = proteins;
    goal.fats = fats;

    await this.goalRepository.update(goal);
  }
}

export namespace UpdateGoalUseCase {
  export type Input = {
    accountId: string;
    calories: number;
    carbohydrates: number;
    fats: number;
    proteins: number;
  };

  export type Output = void;
}
