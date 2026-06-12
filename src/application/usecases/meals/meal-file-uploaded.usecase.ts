import { Meal } from "@application/entities/meal.entity";
import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsQueueGateway } from "@infra/gateways/meals-queue.gateway";
import { MealsStorageGateway } from "@infra/gateways/meals-storage.gateway";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class MealFileUploadedUseCase {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsStorageGateway: MealsStorageGateway,
    private readonly mealsQueueGateway: MealsQueueGateway,
    private readonly logger: ConsoleLogger,
  ) {}

  public async execute({ fileKey }: MealFileUploadedUseCase.Input): Promise<MealFileUploadedUseCase.Output> {
    this.logger.debug({
      message: "Meal file upload handling started",
      metadata: { service: "meals", operation: "meal_file_uploaded", fileKey },
    });

    const { accountId, mealId } = await this.mealsStorageGateway.getFileMetadata({ fileKey });

    this.logger.debug({
      message: "Meal file metadata resolved",
      metadata: { service: "meals", operation: "meal_file_uploaded", fileKey, accountId, mealId },
    });

    const meal = await this.mealsRepository.findById({ accountId, mealId });

    if (!meal) {
      this.logger.warn({
        message: "Meal file upload ignored because meal was not found",
        metadata: { service: "meals", operation: "meal_file_uploaded", fileKey, accountId, mealId },
      });

      throw new ResourceNotFound({ message: "Meal not found" });
    }

    meal.status = Meal.Status.QUEUED;

    // o update no status vem antes da publicacao da mensagem
    // no consumer teremos if status === uploading throw error
    // pode ocorrer a chance da gente mandar pra queue e um consumer pegar direto
    // isso antes do status mudar
    // por isso que esta nessa ordem
    await this.mealsRepository.update(meal);

    this.logger.info({
      message: "Meal queued after file upload",
      metadata: { service: "meals", operation: "meal_file_uploaded", accountId, mealId },
    });

    await this.mealsQueueGateway.publishMessage({ accountId, mealId });

    this.logger.info({
      message: "Meal file upload handling completed",
      metadata: { service: "meals", operation: "meal_file_uploaded", accountId, mealId },
    });
  }
}

export namespace MealFileUploadedUseCase {
  export type Input = { fileKey: string };
  export type Output = void;
}
