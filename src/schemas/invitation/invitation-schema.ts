import { z } from "zod";

// Define Zod schema for team
export const InvitationSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	token: z.string(),
	role: z.string(),
	expires: z.string(),
	acceptedAt: z.string().nullable(),
});

export type InvitationSchemaValues = z.infer<typeof InvitationSchema>;
