import { PutCommandInput, TransactWriteCommand, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamo.client";

export abstract class UnitOfWork<TRunParams extends Record<string, unknown>> {
  private transactItens: NonNullable<TransactWriteCommandInput["TransactItems"]> = [];

  public abstract run(params: TRunParams): Promise<void>;

  protected addOperations(input: PutCommandInput) {
    this.transactItens.push({ Put: input });
  }

  protected async commit() {
    const command = new TransactWriteCommand({
      TransactItems: this.transactItens,
    });

    await dynamoClient.send(command);

    this.transactItens = [];
  }
}

export namespace UnitOfWork {}
