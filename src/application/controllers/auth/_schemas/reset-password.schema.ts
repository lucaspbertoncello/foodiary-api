import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string("$email must be a string").min(1, "$email is required"),
  code: z.string("$code must be a string").min(1, "$code is required"),
  newPassword: z
    .string("$newPassword must be a string")
    .min(8, "$newPassword must be at least 8 characters long"),
});

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
