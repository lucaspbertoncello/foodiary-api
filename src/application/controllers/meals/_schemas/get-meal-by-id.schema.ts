import z from "zod";

export const getMealByIdSchema = z.object({
  mealId: z.string().min(1, "$mealId is required"),
});

export type GetMealByIdParams = z.infer<typeof getMealByIdSchema>;
