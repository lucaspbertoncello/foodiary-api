import { getSchema } from "@kernel/decorators/schema.decorator";

export abstract class Controller<
  TRouteType extends Controller.RouteType,
  TControlerReponse,
  TBody = Record<string, unknown>,
  THeaders = Record<string, unknown>,
  TParams = Record<string, unknown>,
  TQueryParams = Record<string, unknown>,
> {
  protected abstract handle(
    request: Controller.HttpRequest<TRouteType, TBody, THeaders, TParams, TQueryParams>,
  ): Promise<Controller.HttpResponse<TControlerReponse>>;

  public execute(
    request: Controller.HttpRequest<TRouteType, TBody, THeaders, TParams, TQueryParams>,
  ): Promise<Controller.HttpResponse<TControlerReponse>> {
    const validatedRequest = this.validateRequest(request);

    return this.handle(validatedRequest);
  }

  private validateRequest(
    request: Controller.HttpRequest<TRouteType, TBody, THeaders, TParams, TQueryParams>,
  ): Controller.HttpRequest<TRouteType, TBody, THeaders, TParams, TQueryParams> {
    const REQUEST_SCHEMA_KEYS = ["body", "headers", "params", "queryParams"] as const;
    const schemas = getSchema(this);

    if (!schemas) {
      return request;
    }

    return REQUEST_SCHEMA_KEYS.reduce<
      Controller.HttpRequest<TRouteType, TBody, THeaders, TParams, TQueryParams>
    >((validatedRequest, key) => {
      const schema = schemas[key];

      if (!schema) {
        return validatedRequest;
      }

      return {
        ...validatedRequest,
        [key]: schema.parse(validatedRequest[key]),
      };
    }, request);
  }
}

export namespace Controller {
  export type BaseRequest<
    TBody = Record<string, unknown>,
    THeaders = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = {
    body: TBody;
    headers: THeaders;
    params: TParams;
    queryParams: TQueryParams;
  };

  export type RouteType = "private" | "public";

  type PublicRequest<
    TBody = Record<string, unknown>,
    THeaders = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = BaseRequest<TBody, THeaders, TParams, TQueryParams> & { accountId: null };

  type PrivateRequest<
    TBody = Record<string, unknown>,
    THeaders = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = BaseRequest<TBody, THeaders, TParams, TQueryParams> & { accountId: string };

  export type HttpRequest<
    TRouteType extends RouteType,
    TBody = Record<string, unknown>,
    THeaders = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > = TRouteType extends "public"
    ? PublicRequest<TBody, THeaders, TParams, TQueryParams>
    : PrivateRequest<TBody, THeaders, TParams, TQueryParams>;

  export interface HttpResponse<TBody> {
    body?: TBody;
    statusCode: number;
  }
}
