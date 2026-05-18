import { ApplicationError } from "@application/contracts/application-error.contract";
import { Controller } from "@application/contracts/controller.contract";
import { HttpError } from "@application/contracts/http-error.contract";
import { ErrorCode } from "@application/errors/error-code";
import { Registry } from "@kernel/di/registry";
import { lambdaBodyParser } from "@main/utils/lambda-body-parser";
import { lambdaErrorResponse } from "@main/utils/lambda-error-response";
import { Constructor } from "@shared/@types/constructor.type";

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { ZodError } from "zod";

export function lambdaHttpAdapter({ controllerImpl }: { controllerImpl: LambdaHttpAdapter.ControllerImpl }) {
  return async (event: LambdaHttpAdapter.Event): Promise<APIGatewayProxyResultV2> => {
    try {
      const controllerInstance = Registry.getInstance().resolve(controllerImpl);

      const body = lambdaBodyParser(event.body);
      const headers = event.headers ?? {};
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const accountId =
        "authorizer" in event.requestContext ? event.requestContext.authorizer.jwt.claims.internalId : null;

      console.log({ accountId });

      const result = await controllerInstance.execute({ body, headers, params, queryParams });

      return {
        statusCode: result.statusCode,
        body: result.body ? JSON.stringify(result.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return lambdaErrorResponse({
          statusCode: 400,
          code: ErrorCode.VALIDATION,
          message: error.issues.map((issue) => ({ field: issue.path.join("."), error: issue.message })),
        });
      }

      if (error instanceof HttpError) {
        return lambdaErrorResponse(error);
      }

      if (error instanceof ApplicationError) {
        return lambdaErrorResponse({
          statusCode: error.statusCode ?? 400,
          code: error.code,
          message: error.message,
        });
      }

      console.error(error);

      return lambdaErrorResponse({
        statusCode: 500,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error.",
      });
    }
  };
}

export namespace LambdaHttpAdapter {
  export type ControllerImpl = Constructor<Controller>;
  export type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer;
}
