import { Profile } from "@application/entities/profile.entity";
import z from "zod";

export const signupSchema = z.object({
  account: z.object(
    {
      email: z.email("$account.email must be a valid email"),
      password: z
        .string("$account.password must be a string")
        .min(8, "$account.password must be at least 8 characters long"),
    },
    "$account is required",
  ),

  profile: z.object(
    {
      name: z.string("$profile.name must be a string"),
      birthDate: z.iso.date("$profile.birthDate must be a valid ISO date"),
      gender: z.enum(Profile.Gender, "$profile.gender must be a valid gender"),
      height: z.number("$profile.height must be a number"),
      weight: z.number("$profile.weight must be a number"),
      activityLevel: z.enum(Profile.ActivityLevel, "$profile.activityLevel must be a valid activity level"),
    },
    "$profile is required",
  ),
});

export type SignupBody = z.infer<typeof signupSchema>;
