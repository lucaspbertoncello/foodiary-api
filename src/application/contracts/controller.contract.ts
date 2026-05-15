import { getSchema } from "@kernel/decorators/schema.decorator";

export abstract class Controller<TBody = undefined> {
  protected abstract handle(request: Controller.HttpRequest): Promise<Controller.HttpResponse<TBody>>;

  public execute(request: Controller.HttpRequest): Promise<Controller.HttpResponse<TBody>> {
    const body = this.validateBody(request.body);
    return this.handle({ ...request, body });
  }

  private validateBody(body: Controller.HttpRequest["body"]) {
    const schema = getSchema(this);

    if (!schema) {
      return body;
    }

    return schema.parse(body);
  }
}

export namespace Controller {
  export interface HttpRequest<
    TBody extends Record<string, unknown> | unknown = unknown,
    THeaders extends Record<string, unknown> | unknown = unknown,
    TParams extends Record<string, unknown> | unknown = unknown,
    TQueryParams extends Record<string, unknown> | unknown = unknown,
  > {
    body?: TBody;
    headers?: THeaders;
    params?: TParams;
    queryParams?: TQueryParams;
  }

  export interface HttpResponse<TBody extends Record<string, unknown> | unknown = unknown> {
    body?: TBody;
    statusCode: number;
  }
}
