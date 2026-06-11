import { IFileEventHandler } from "@application/@interfaces/file-event-handler.interface";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Registry } from "@kernel/container/registry";
import { Constructor } from "@shared/@types/constructor.type";
import { S3Event } from "aws-lambda";

export function lambdaS3Adapter({
  handlerImpl,
}: {
  handlerImpl: LambdaS3Adapter.HandlerImpl;
}): LambdaS3Adapter.Handler {
  return async (event: S3Event) => {
    const registry = Registry.getInstance();
    const logger = registry.resolve(ConsoleLogger);
    const handler = registry.resolve(handlerImpl);
    const operation = handlerImpl.name;

    logger.info({
      message: "S3 event processing started",
      metadata: {
        service: "s3",
        operation,
        recordsCount: event.Records.length,
      },
    });

    const responses = await Promise.allSettled(
      event.Records.map(async (record) => {
        const fileKey = record.s3.object.key;

        logger.debug({
          message: "S3 record processing started",
          metadata: { service: "s3", operation, fileKey },
        });

        await handler.handle({ fileKey });

        logger.info({
          message: "S3 record processing completed",
          metadata: { service: "s3", operation, fileKey },
        });
      }),
    );

    const failedEvents = responses.filter((response) => {
      return response.status === "rejected";
    });

    if (failedEvents.length) {
      for (const event of failedEvents) {
        logger.error({
          message: "S3 event processing failed",
          metadata: {
            service: "s3",
            operation,
            error: event.reason,
          },
        });
      }
    }

    logger.info({
      message: "S3 event processing completed",
      metadata: {
        service: "s3",
        operation,
        recordsCount: event.Records.length,
        failedRecordsCount: failedEvents.length,
      },
    });

    return event;
  };
}

export namespace LambdaS3Adapter {
  export type HandlerImpl = Constructor<IFileEventHandler>;
  export type Handler = (event: S3Event) => Promise<S3Event>;
}
