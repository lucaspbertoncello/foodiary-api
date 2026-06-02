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
    const body = this.validateBody(request.body);
    return this.handle({ ...request, body });
  }

  private validateBody(body: TBody): TBody {
    const schema = getSchema(this);

    if (!schema) {
      return body;
    }

    return schema.parse(body) as TBody;
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
