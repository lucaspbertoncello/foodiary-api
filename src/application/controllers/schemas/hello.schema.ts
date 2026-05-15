import z from "zod";

export const helloSchema = z.object({
  hello: z.boolean(),
});

export type HelloBody = z.infer<typeof helloSchema>;
