export abstract class Logger {
  protected abstract write({ message, type, metadata }: Logger.WriteParams): void;
  protected abstract shouldLog(type: Logger.LogType): boolean;

  public debug(params: Logger.Params) {
    this.log({ type: Logger.LogType.DEBUG, ...params });
  }

  public info(params: Logger.Params) {
    this.log({ type: Logger.LogType.INFO, ...params });
  }

  public warn(params: Logger.Params) {
    this.log({ type: Logger.LogType.WARN, ...params });
  }

  public error(params: Logger.Params) {
    this.log({ type: Logger.LogType.ERROR, ...params });
  }

  private log(params: Logger.WriteParams): void {
    if (!this.shouldLog(params.type)) {
      return;
    }

    this.write(params);
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

  export type LogMetadata = Record<string, unknown>;

  export type WriteParams = { type: LogType; message: LogMessage; metadata: LogMetadata };

  export type Params = { message: LogMessage; metadata: LogMetadata };
}
