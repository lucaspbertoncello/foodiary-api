import { IWorker } from "@application/@interfaces/worker.interface";
import { ProcessMealUseCase } from "@application/usecases/meals/process-meal.usecase";
import { Injectable } from "@kernel/decorators/injectable.decorator";

// outro caso de "controller", so que para consumers de filas
@Injectable()
export class ProcessMealWorker implements IWorker<ProcessMealWorker.Input> {
  constructor(private readonly processMealUseCase: ProcessMealUseCase) {}

  async consume({ accountId, mealId }: ProcessMealWorker.Input): Promise<ProcessMealWorker.Output> {
    await this.processMealUseCase.execute({ accountId, mealId });
  }
}

export namespace ProcessMealWorker {
  export type Input = { accountId: string; mealId: string };
  export type Output = void;
}
