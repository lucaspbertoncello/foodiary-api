import { HttpError } from "@application/contracts/http-error.contract";
import { ErrorCode } from "@application/errors/error-code";

export class BadRequest extends HttpError {
  public override statusCode = 400;
  public override code: ErrorCode;

  constructor({ message, code }: { message?: any; code?: ErrorCode }) {
    super();

    this.name = "BadRequest";
    this.message = message ?? "Bad Request";
    this.code = code ?? ErrorCode.BAD_REQUEST;
  }
}
