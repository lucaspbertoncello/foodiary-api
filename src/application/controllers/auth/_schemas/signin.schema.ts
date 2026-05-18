import z from "zod";

export const signinSchema = z.object({
  account: z.object({
    email: z.email(),
    password: z.string().min(8, "Password should be at least 8 characters long"),
  }),
});

export type SigninBody = z.infer<typeof signinSchema>;
