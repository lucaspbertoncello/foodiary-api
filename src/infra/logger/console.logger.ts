import { Logger } from "@application/contracts/logger.contract";
import { Injectable } from "@kernel/decorators/injectable.decorator";

@Injectable()
export class ConsoleLogger extends Logger {
  public override write({ message, type, metadata }: Logger.WriteParams): void {
    // eslint-disable-next-line no-console
    console[type](
      JSON.stringify({
        type,
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
      }),
    );
  }
}
