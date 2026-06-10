import z from "zod";

const schema = z.object({
  COGNITO_CLIENT_ID: z.string().min(1),
  COGNITO_POOL_ID: z.string().min(1),
  COGNITO_CLIENT_SECRET: z.string().min(1),
  MAIN_TABLE_NAME: z.string().min(1),
  MEALS_BUCKET_NAME: z.string().min(1),
  MEALS_CDN_DOMAIN_NAME: z.string().min(1),
  DEV_MODE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
});

export const env = schema.parse(process.env);
