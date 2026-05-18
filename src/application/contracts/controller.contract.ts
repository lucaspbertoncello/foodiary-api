import { getSchema } from "@kernel/decorators/schema.decorator";

export abstract class Controller {
  protected abstract handle(request: Controller.HttpRequest): Promise<Controller.HttpResponse>;

  public execute(request: Controller.HttpRequest): Promise<Controller.HttpResponse> {
    const body = this.validateBody(request.body);
    return this.handle({ ...request, body });
  }

  private validateBody(body: Controller.HttpRequest["body"]): Record<string, unknown> {
    const schema = getSchema(this);

    if (!schema) {
      return body;
    }

    return schema.parse(body) as Record<string, unknown>;
  }
}

export namespace Controller {
  export interface HttpRequest<
    TBody = Record<string, unknown>,
    THeaders = Record<string, unknown>,
    TParams = Record<string, unknown>,
    TQueryParams = Record<string, unknown>,
  > {
    body: TBody;
    headers: THeaders;
    params: TParams;
    queryParams: TQueryParams;
  }

  export interface HttpResponse<TBody = Record<string, unknown>> {
    body?: TBody;
    statusCode: number;
  }
}
