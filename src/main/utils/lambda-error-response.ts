import { ErrorCode } from "@application/errors/error-code";

export function lambdaErrorResponse({ code, message, statusCode }: LambdaErrorResponse.Params) {
  return {
    statusCode,
    body: JSON.stringify({
      code,
      message,
    }),
  };
}

export namespace LambdaErrorResponse {
  export interface Params {
    statusCode: number;
    code: ErrorCode;
    message: any;
  }

  export interface Response {}
}
