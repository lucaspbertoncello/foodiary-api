import { ApplicationError } from "@application/contracts/application-error.contract";
import { ErrorCode } from "../error-code";

export class InvalidCredentials extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode?: number;

  constructor({ message, code }: { message?: any; code?: ErrorCode }) {
    super();

    this.name = "InvalidCredentials";
    this.message = message ?? "Invalid credentials.";
    this.code = code ?? ErrorCode.INVALID_CREDENTIALS;
  }
}
