import { UserRole } from "@prisma/client";
import { z } from "zod";

// Define Zod schema for team
export const InvitationSchema = z.object({
  email: z.string().email(),
  expires: z.date(),
  hasAccepted: z.boolean(),
  hasExpired: z.boolean(),
  id: z.string(),
  invitedById: z.string(),
  role: z.nativeEnum(UserRole),
  token: z.string(),
});

export const AlternativeInvitationSchema = InvitationSchema.omit({
  role: true,
}).extend({ role: z.string() });

// Used when role is a string
export type AlternativeInvitationSchemaValues = z.infer<
  typeof AlternativeInvitationSchema
>;

export type InvitationSchemaValues = z.infer<typeof InvitationSchema>;
