import z from "zod";

export const signinSchema = z.object({
  account: z.object(
    {
      email: z.email("$account.email must be a valid email"),
      password: z
        .string("$account.password must be a string")
        .min(8, "$account.password must be at least 8 characters long"),
    },
    "$account is required",
  ),
});

export type SigninBody = z.infer<typeof signinSchema>;
