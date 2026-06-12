import { ResourceNotFound } from "@application/errors/application/resource-not-found.error";
import { PublishMealProducer } from "@application/queues/producers/publish-meal.producer";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsStorageGateway } from "@infra/gateways/meals-storage.gateway";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class MealFileUploadedUseCase {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsStorageGateway: MealsStorageGateway,
    private readonly publishMealProducer: PublishMealProducer,
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

    await this.publishMealProducer.publish({ meal });

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
