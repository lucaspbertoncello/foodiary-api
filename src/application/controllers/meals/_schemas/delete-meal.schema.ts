import z from "zod";

export const deleteMealSchema = z.object({
  mealId: z.string().min(1, "$mealId is required"),
});

export type DeleteMealParams = z.infer<typeof deleteMealSchema>;
