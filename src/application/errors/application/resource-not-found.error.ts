import { ApplicationError } from "@application/contracts/application-error.contract";
import { ErrorCode } from "../error-code";

export class ResourceNotFound extends ApplicationError {
  public override code: ErrorCode;
  public override statusCode?: number = 404;

  constructor({ message, code }: { message?: any; code?: ErrorCode }) {
    super();

    this.name = "ResourceNotFound";
    this.message = message ?? "Resource not found.";
    this.code = code ?? ErrorCode.RESOURCE_NOT_FOUND;
  }
}
