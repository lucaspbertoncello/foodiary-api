import { IFileEventHandler } from "@application/@interfaces/file-event-handler.interface";
import { MealFileUploadedUseCase } from "@application/usecases/meals/meal-file-uploaded.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";

// um event eh basicamente um controller. so que pra triggers, nao lambdas
// entao temos que ter um usecase sim
@Injectable()
export class MealFileUploadedEvent implements IFileEventHandler {
  constructor(private readonly mealFileUploadedUseCase: MealFileUploadedUseCase) {}

  public async handle({ fileKey }: IFileEventHandler.Input): Promise<IFileEventHandler.Output> {
    return this.mealFileUploadedUseCase.execute({ fileKey });
  }
}
