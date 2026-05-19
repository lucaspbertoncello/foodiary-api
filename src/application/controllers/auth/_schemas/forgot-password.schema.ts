import z from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string("$email must be a string").min(1, "$email is required"),
});

export type ForgotPasswordBody = z.infer<typeof forgotPasswordSchema>;
