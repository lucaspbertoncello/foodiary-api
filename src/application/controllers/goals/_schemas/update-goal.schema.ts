import z from "zod";

export const updateGoalSchema = z.object({
  calories: z.number("$calories must be a number"),
  carbohydrates: z.number("$carbohydrates must be a number"),
  fats: z.number("$fats must be a number"),
  proteins: z.number("$proteins must be a number"),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;
