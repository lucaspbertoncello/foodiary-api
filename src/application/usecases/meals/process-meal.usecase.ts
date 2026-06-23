import { Meal } from "@application/entities/meal.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsAIGateway } from "@infra/gateways/meals-ai.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

// limite para cair na DLQ
const MAX_ATTEMPTS = 2;

@Injectable()
export class ProcessMealUseCase {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsAiGateway: MealsAIGateway,
  ) {}

  public async execute({ mealId, accountId }: ProcessMealUseCase.Input): Promise<ProcessMealUseCase.Output> {
    const meal = await this.mealsRepository.findById({ accountId, mealId });

    if (!meal) {
      throw new ResourceNotFound({ message: "Meal not found." });
    }

    if (meal.status === Meal.Status.PENDING) {
      throw new Error(`Meal ${mealId} is still uploading`);
    }

    if (meal.status === Meal.Status.PROCESSING) {
      throw new Error(`Meal ${mealId} is already being processed.`);
    }

    // damos o return aqui apenas para evitar que a mensagem seja reprocessada
    // throw adiciona a mensagem no batchItemFailures
    if (meal.status === Meal.Status.FAILED || meal.status === Meal.Status.SUCCESS) {
      return;
    }

    // trecho que mantem o codigo idempotente
    // quando cai no try, ja atualiza no banco o status da meal
    try {
      meal.status = Meal.Status.PROCESSING;
      meal.attempts += 1;

      await this.mealsRepository.update(meal);

      const { foods, icon, name } = await this.mealsAiGateway.processMeal(meal);
      meal.name = name;
      meal.icons = icon;
      meal.foods = foods;
      meal.status = Meal.Status.SUCCESS;

      await this.mealsRepository.update(meal);
    } catch (error) {
      // aqui basicamente estamos dizendo que se a mensagem ja foi reprocessada duas vezes ou mais, ela ja caiu na DLQ
      // estamos apenas atualizando no banco

      // se ela caiu no catch mas nao atingiu o max attempts, a mensagem falhou pela primeira vez. ai atualizamos pra queued no banco
      // para indicar que vai ser reprocessada
      meal.status = meal.attempts >= MAX_ATTEMPTS ? Meal.Status.FAILED : Meal.Status.QUEUED;
      await this.mealsRepository.update(meal);
      throw error;
    }
  }
}

export namespace ProcessMealUseCase {
  export type Input = { mealId: string; accountId: string };

  export type Output = void;
}
