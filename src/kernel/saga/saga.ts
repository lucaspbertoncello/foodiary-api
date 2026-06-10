import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class Saga {
  private compensations: Saga.Compensations = [];

  // funcao wrapper das implementacoes
  public async run<T = unknown>(fn: () => Promise<T>) {
    try {
      return await fn();
    } catch (error) {
      await this.compensate();
      throw error;
    }
  }

  // funcao para registrar as funcoes de rollback
  public addCompensation(compensationFn: Saga.CompensationFn) {
    this.compensations.unshift(compensationFn);
  }

  // executa todos as funcoes de casos de erro que foram registradas
  // exemplo: deleteCognitoUser
  private async compensate() {
    for await (const compensation of this.compensations) {
      try {
        await compensation();
      } catch {
      } finally {
        this.compensations = [];
      }
    }
  }
}

export namespace Saga {
  export type CompensationFn = () => Promise<void>;
  export type Compensations = Array<CompensationFn>;
}
