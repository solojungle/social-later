import { UserRole } from "@prisma/client";
import { z } from "zod";

// Define Zod schema for team
export const UserSchema = z.object({
  email: z.string().email(),
  id: z.string(),
  image: z.string(),
  name: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(32, {
      message: "Name must not be longer than 32 characters.",
    }),
  url: z
    .string()
    .min(1, {
      message: "Name must be at least 1 characters.",
    })
    .max(48, {
      message: "Name must not be longer than 48 characters.",
    }),
});

export type UserSchemaValues = z.infer<typeof UserSchema>;

export const userStoreDefaultValues: UserSchemaValues = {
  email: "",
  id: "",
  image: "",
  name: "",
  url: "",
};

export const TeamMembers = UserSchema.pick({
  email: true,
  id: true,
  image: true,
  name: true,
}).extend({
  role: z.nativeEnum(UserRole),
});

export type TeamMembersSchemaValues = z.infer<typeof TeamMembers>;
