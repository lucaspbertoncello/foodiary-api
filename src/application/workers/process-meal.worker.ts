import { IWorker } from "@application/@interfaces/worker.interface";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class ProcessMealWorker implements IWorker<ProcessMealWorker.Input> {
  async consume(input: ProcessMealWorker.Input): Promise<void> {
    console.log(JSON.stringify(input, null, 2));
  }
}

export namespace ProcessMealWorker {
  export type Input = { accountId: string; mealId: string };
}
