import { IWorker } from "@application/@interfaces/worker.interface";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Registry } from "@kernel/container/registry";
import { Constructor } from "@shared/@types/constructor.type";
import { SQSBatchItemFailure, SQSBatchResponse, SQSEvent } from "aws-lambda";

export function lambdaSqsAdapter({ handlerImpl }: LambdaSqsAdater.Handler) {
  return async (event: SQSEvent): Promise<LambdaSqsAdater.Event> => {
    const batchItemFailures: SQSBatchItemFailure[] = [];
    const registry = Registry.getInstance();
    const logger = registry.resolve(ConsoleLogger);
    const handler = registry.resolve(handlerImpl);
    const operation = handlerImpl.name;

    logger.info({
      message: "SQS batch processing started",
      metadata: { service: "sqs", operation, recordsCount: event.Records.length },
    });

    for (const record of event.Records) {
      try {
        const body = (JSON.parse(record.body) as Record<string, any>) ?? {};

        await handler.consume(body);
      } catch (error) {
        logger.error({
          message: "SQS message processing failed",
          metadata: { service: "sqs", operation, messageId: record.messageId, error },
        });

        batchItemFailures.push({ itemIdentifier: record.messageId });
      }
    }

    logger.info({
      message: "SQS batch processing completed",
      metadata: {
        service: "sqs",
        operation,
        recordsCount: event.Records.length,
        failedRecordsCount: batchItemFailures.length,
      },
    });

    return { batchItemFailures };
  };
}

export namespace LambdaSqsAdater {
  export type Handler = { handlerImpl: Constructor<IWorker<Record<string, unknown>>> };
  export type Event = Promise<SQSBatchResponse>;
}
