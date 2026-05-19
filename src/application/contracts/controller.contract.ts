import { getSchema } from "@kernel/decorators/schema.decorator";

export abstract class Controller<TRouteType extends Controller.RouteType, TControlerReponse> {
  protected abstract handle(
    request: Controller.HttpRequest<TRouteType>,
  ): Promise<Controller.HttpResponse<TControlerReponse>>;

  public execute(
    request: Controller.HttpRequest<TRouteType>,
  ): Promise<Controller.HttpResponse<TControlerReponse>> {
    const body = this.validateBody(request.body);
    return this.handle({ ...request, body });
  }

  private validateBody(body: Controller.HttpRequest<TRouteType>["body"]): Record<string, unknown> {
    const schema = getSchema(this);

    if (!schema) {
      return body;
    }

    return schema.parse(body) as Record<string, unknown>;
  }
}

export namespace Controller {
  type BaseRequest<
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
