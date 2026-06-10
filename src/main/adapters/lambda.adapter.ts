import { ApplicationError } from "@application/contracts/application-error.contract";
import { HttpError } from "@application/contracts/http-error.contract";
import { ErrorCode } from "@application/errors/error-code";
import { ConsoleLogger } from "@infra/logger/console.logger";
import { Registry } from "@kernel/container/registry";
import { lambdaBodyParser } from "@main/utils/lambda-body-parser";
import { lambdaErrorResponse } from "@main/utils/lambda-error-response";
import { Constructor } from "@shared/@types/constructor.type";
import { HttpMethod } from "@shared/@types/http-method.type";
import { ServiceException } from "@smithy/smithy-client";

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyEventV2WithJWTAuthorizer,
  APIGatewayProxyResultV2,
} from "aws-lambda";

import { ZodError } from "zod";

export function lambdaHttpAdapter({ controllerImpl }: { controllerImpl: LambdaHttpAdapter.ControllerImpl }) {
  return async (event: LambdaHttpAdapter.Event): Promise<APIGatewayProxyResultV2> => {
    const startedAt = Date.now();
    const registry = Registry.getInstance();
    const logger = registry.resolve(ConsoleLogger);
    const operation = controllerImpl.name;
    const requestId = event.requestContext.requestId;
    const route = event.rawPath;
    const httpMethod = event.requestContext.http.method as HttpMethod;
    const accountId =
      "authorizer" in event.requestContext
        ? (event.requestContext.authorizer.jwt.claims.internalId as string)
        : null;

    try {
      logger.debug({
        message: "HTTP request started",
        metadata: { service: "http", operation, requestId, route, httpMethod, accountId },
      });

      const controllerInstance = registry.resolve(controllerImpl);

      const body = lambdaBodyParser(event.body);
      const headers = event.headers ?? {};
      const params = event.pathParameters ?? {};
      const queryParams = event.queryStringParameters ?? {};

      const result = await controllerInstance.execute({ body, headers, params, queryParams, accountId });
      const durationMs = Date.now() - startedAt;

      logger.info({
        message: "HTTP request completed",
        metadata: {
          service: "http",
          operation,
          requestId,
          route,
          httpMethod,
          accountId,
          statusCode: result.statusCode,
          durationMs,
        },
      });

      return {
        statusCode: result.statusCode,
        body: result.body ? JSON.stringify(result.body) : undefined,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn({
          message: "HTTP request validation failed",
          metadata: {
            service: "http",
            operation,
            requestId,
            route,
            httpMethod,
            accountId,
            statusCode: 400,
            durationMs: Date.now() - startedAt,
          },
        });

        return lambdaErrorResponse({
          statusCode: 400,
          code: ErrorCode.VALIDATION,
          message: error.issues.map((issue) => ({ field: issue.path.join("."), error: issue.message })),
        });
      }

      if (error instanceof HttpError) {
        logger.warn({
          message: "HTTP request failed",
          metadata: {
            service: "http",
            operation,
            requestId,
            route,
            httpMethod,
            accountId,
            statusCode: error.statusCode,
            durationMs: Date.now() - startedAt,
            error,
          },
        });

        return lambdaErrorResponse(error);
      }

      if (error instanceof ApplicationError) {
        logger.warn({
          message: "HTTP request application error",
          metadata: {
            service: "http",
            operation,
            requestId,
            route,
            httpMethod,
            accountId,
            statusCode: error.statusCode ?? 400,
            durationMs: Date.now() - startedAt,
            error,
          },
        });

        return lambdaErrorResponse({
          statusCode: error.statusCode ?? 400,
          code: error.code,
          message: error.message,
        });
      }

      if (error instanceof ServiceException) {
        logger.error({
          message: "HTTP request AWS service error",
          metadata: {
            service: "http",
            operation,
            requestId,
            route,
            httpMethod,
            accountId,
            statusCode: error.$metadata.httpStatusCode ?? 400,
            durationMs: Date.now() - startedAt,
            error,
          },
        });

        return lambdaErrorResponse({
          code: ErrorCode.BAD_REQUEST,
          message: error.message,
          statusCode: error.$metadata.httpStatusCode ?? 400,
        });
      }

      logger.error({
        message: "HTTP request unexpected error",
        metadata: {
          service: "http",
          operation,
          requestId,
          route,
          httpMethod,
          accountId,
          statusCode: 500,
          durationMs: Date.now() - startedAt,
          error,
        },
      });

      return lambdaErrorResponse({
        statusCode: 500,
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Internal server error.",
      });
    }
  };
}

export namespace LambdaHttpAdapter {
  export type ControllerImpl = Constructor<any>;
  export type Event = APIGatewayProxyEventV2 | APIGatewayProxyEventV2WithJWTAuthorizer;
}
