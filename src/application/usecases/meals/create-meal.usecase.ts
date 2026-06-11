import { Meal } from "@application/entities/meal.entity";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsStorageGateway } from "@infra/gateways/meals-storage.gateway";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsStorageGateway: MealsStorageGateway,
    private readonly logger: ConsoleLogger,
  ) {}

  public async execute({ accountId, file }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
    this.logger.debug({
      message: "Create meal started",
      metadata: { service: "meals", operation: "create_meal", accountId },
    });

    const inputType = file.type === "audio/m4a" ? Meal.InputType.AUDIO : Meal.InputType.PICTURE;
    const inputFileKey = MealsStorageGateway.generateInputFileKey({ accountId, inputType });

    const meal = new Meal({
      accountId,
      inputFileKey,
      inputType,
      status: Meal.Status.PENDING,
    });

    const [, { uploadSignature }] = await Promise.all([
      this.mealsRepository.save(meal),

      this.mealsStorageGateway.createPresignedPost({
        file: { fileKey: inputFileKey, fileSize: file.size, inputType },
        mealId: meal.id,
        accountId: meal.accountId,
      }),
    ]);

    this.logger.info({
      message: "Create meal completed",
      metadata: { service: "meals", operation: "create_meal", accountId },
    });

    return {
      mealId: meal.id,
      uploadSignature,
    };
  }
}

export namespace CreateMealUseCase {
  export type Input = { accountId: string; file: { type: string; size: number } };
  export type Output = { mealId: string; uploadSignature: string };
}
