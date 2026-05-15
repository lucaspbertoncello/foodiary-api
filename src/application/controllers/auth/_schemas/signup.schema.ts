import z from "zod";

export const signupSchema = z.object({
  account: z.object({
    email: z.email(),
    password: z.string().min(8, "Password should be at least 8 characters long"),
  }),
});

export type SignupBody = z.infer<typeof signupSchema>;
