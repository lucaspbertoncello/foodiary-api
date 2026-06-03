import { Logger } from "@application/contracts/logger.contract";
import { Injectable } from "@kernel/decorators/injectable.decorator";
import { AppConfig } from "@shared/config/app.config";

@Injectable()
export class ConsoleLogger extends Logger {
  constructor(private readonly appConfig: AppConfig) {
    super();
  }

  public override write({ message, type, metadata }: Logger.WriteParams): void {
    const { error, ...restMetadata } = metadata;

    // eslint-disable-next-line no-console
    console[type](
      JSON.stringify({
        type,
        message,
        timestamp: new Date().toISOString(),
        ...restMetadata,
        error: error ? this.serializeError(error) : undefined,
      }),
    );
  }

  private serializeError(error: unknown): ConsoleLogger.SerializedError {
    if (!(error instanceof Error)) {
      return { name: "UnknownError", message: String(error) };
    }

    const serializedError: ConsoleLogger.SerializedError = {
      name: error.name,
      message: error.message,
    };

    if (this.appConfig.devMode && error.stack) {
      serializedError.stack = error.stack;
    }

    return serializedError;
  }

  protected override shouldLog(type: Logger.LogType): boolean {
    if (this.appConfig.devMode) {
      return true;
    }

    return type !== Logger.LogType.DEBUG;
  }
}

export namespace ConsoleLogger {
  export type SerializedError = {
    name: string;
    message: string;
    stack?: string;
  };
}
