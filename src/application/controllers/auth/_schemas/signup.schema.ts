import { Profile } from "@application/entities/profile.entity";
import z from "zod";

export const signupSchema = z.object({
  account: z.object({
    email: z.email(),
    password: z.string().min(8, "Password should be at least 8 characters long"),
  }),

  profile: z.object({
    name: z.string(),
    birthDate: z.iso.date(),
    gender: z.enum(Profile.Gender),
    height: z.number(),
    weight: z.number(),
    activityLevel: z.enum(Profile.ActivityLevel),
  }),
});

export type SignupBody = z.infer<typeof signupSchema>;
