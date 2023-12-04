import { UserRole } from "@prisma/client";
import { z } from "zod";

// Define Zod schema for team
export const InvitationSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	token: z.string(),
	role: z.nativeEnum(UserRole),
	expires: z.date(),
	hasExpired: z.boolean(),
	hasAccepted: z.boolean(),
	invitedById: z.string(),
});

export const AlternativeInvitationSchema = InvitationSchema.omit({
	role: true,
}).extend({ role: z.string() });

export type InvitationSchemaValues = z.infer<typeof InvitationSchema>;

// Used when role is a string
export type AlternativeInvitationSchemaValues = z.infer<
	typeof AlternativeInvitationSchema
>;
