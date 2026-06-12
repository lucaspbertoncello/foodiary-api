import { Meal } from "@application/entities/meal.entity";
import { IQueueProducer } from "@application/@interfaces/queue-producer.interface";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsQueueGateway } from "@infra/gateways/meals-queue.gateway";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class PublishMealProducer implements IQueueProducer<PublishMealProducer.Input> {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsQueueGateway: MealsQueueGateway,
    private readonly logger: ConsoleLogger,
  ) {}

  public async publish({ meal }: PublishMealProducer.Input): Promise<void> {
    meal.status = Meal.Status.QUEUED;

    // o update no status vem antes da publicacao da mensagem
    // no consumer teremos if status === uploading throw error
    // pode ocorrer a chance da gente mandar pra queue e um consumer pegar direto
    // isso antes do status mudar
    // por isso que esta nessa ordem
    await this.mealsRepository.update(meal);

    this.logger.info({
      message: "Meal queued for processing",
      metadata: {
        service: "meals",
        operation: "publish_meal",
        accountId: meal.accountId,
        mealId: meal.id,
      },
    });

    await this.mealsQueueGateway.publishMessage({ accountId: meal.accountId, mealId: meal.id });
  }
}

export namespace PublishMealProducer {
  export type Input = { meal: Meal };
}
