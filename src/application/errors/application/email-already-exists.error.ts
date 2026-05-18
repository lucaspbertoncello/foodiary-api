import { ApplicationError } from "@application/contracts/application-error.contract";
import { ErrorCode } from "../error-code";

export class EmailAlreadyExists extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode?: number = 409;

  constructor({ message, code }: { message?: any; code?: ErrorCode }) {
    super();

    this.name = "EmailAlreadyInUse";
    this.message = message ?? "This e-mail is already in use.";
    this.code = code ?? ErrorCode.EMAIL_ALREADY_IN_USE;
  }
}
