import { Profile } from "@application/entities/profile.entity";
import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string("$name must be a string"),
  birthDate: z.iso.date("$birthDate must be a valid ISO date"),
  gender: z.enum(Profile.Gender, "$gender must be a valid gender"),
  height: z.number("$height must be a number"),
  weight: z.number("$weight must be a number"),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
