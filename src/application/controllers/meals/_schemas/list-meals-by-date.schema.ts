import z from "zod";

export const listMealsByDateSchema = z.object({
  date: z
    .string()
    .min(1, "$date is required")
    .transform((date) => new Date(date)),
});

export type ListMealsByDateQueryParams = z.output<typeof listMealsByDateSchema>;
