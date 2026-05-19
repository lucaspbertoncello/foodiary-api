import { ApplicationError } from "@application/contracts/application-error.contract";
import { ErrorCode } from "../error-code";

export class InvalidRefreshToken extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode?: number;

  constructor({ message, code }: { message?: any; code?: ErrorCode }) {
    super();

    this.name = "InvalidRefreshToken";
    this.message = message ?? "Invalid refresh token.";
    this.code = code ?? ErrorCode.INVALID_REFRESH_TOKEN;
  }
}
