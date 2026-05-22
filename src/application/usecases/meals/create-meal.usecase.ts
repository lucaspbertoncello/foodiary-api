import { Meal } from "@application/entities/meal.entity";
import { MealRepository } from "@infra/database/dynamo/repositories/meal.repository";
import { MealsStorageGateway } from "@infra/gateways/meals-storage.gateway";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class CreateMealUseCase {
  constructor(
    private readonly mealsRepository: MealRepository,
    private readonly mealsStorageGateway: MealsStorageGateway,
  ) {}

  public async execute({ accountId, file }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
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
        fileKey: inputFileKey,
        fileSize: file.size,
        inputType,
      }),
    ]);

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
