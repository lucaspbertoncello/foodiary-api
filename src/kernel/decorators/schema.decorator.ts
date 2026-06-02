import "reflect-metadata";
import z from "zod";

const SCHEMA_METADATA_KEY = "controller::schemas";

export function Schema(schemas: SchemaDecorator.SchemaInput): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(SCHEMA_METADATA_KEY, schemas, target);
  };
}

export function getSchema(target: any): SchemaDecorator.SchemaInput | undefined {
  return Reflect.getMetadata(SCHEMA_METADATA_KEY, target.constructor);
}

export namespace SchemaDecorator {
  export type SchemaInput = Partial<{
    body: z.ZodType<unknown>;
    headers: z.ZodType<unknown>;
    params: z.ZodType<unknown>;
    queryParams: z.ZodType<unknown>;
  }>;
}
