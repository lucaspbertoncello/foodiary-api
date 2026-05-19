import z from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().min(1),
  code: z.string().min(1),
  newPassword: z.string().min(8, "Password should be at least 8 characters long"),
});

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema>;
