export abstract class Logger {
  protected abstract write({ message, type, metadata }: Logger.WriteParams): void;

  public debug(params: Logger.Params) {
    this.write({ type: Logger.LogType.DEBUG, ...params });
  }

  public info(params: Logger.Params) {
    this.write({ type: Logger.LogType.INFO, ...params });
  }

  public warn(params: Logger.Params) {
    this.write({ type: Logger.LogType.WARN, ...params });
  }

  public error(params: Logger.Params) {
    this.write({ type: Logger.LogType.ERROR, ...params });
  }
}

export namespace Logger {
  export enum LogType {
    DEBUG = "debug",
    INFO = "info",
    ERROR = "error",
    WARN = "warn",
  }

  export enum MessageStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
  }

  export type LogMessage = string;

  export type LogMetadata = {
    accountId?: string | null;
    requestId?: string;
    httpMethod?: "PUT" | "POST" | "PATCH" | "DELETE" | "GET";
    route?: string;
    error?: { name: string; message: string };
    service: string;
    operation: string;
  };

  export type WriteParams = { type: LogType; message: LogMessage; metadata: LogMetadata };

  export type Params = { message: LogMessage; metadata: LogMetadata };
}
