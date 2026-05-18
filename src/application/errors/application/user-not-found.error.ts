import { ApplicationError } from "@application/contracts/application-error.contract";
import { ErrorCode } from "../error-code";

export class UserNotFound extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode?: number;

  constructor({ message, code }: { message?: any; code?: ErrorCode }) {
    super();

    this.name = "UserNotFound";
    this.message = message ?? "User not found.";
    this.code = code ?? ErrorCode.USER_NOT_FOUND;
  }
}
