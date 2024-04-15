import { z } from "zod";

// Define Zod schema for team
export const SocialProfilesSchema = z.object({
	id: z.string(),
	username: z.string(),
	name: z.string().optional().nullable(),
	accessToken: z.string(),
	refreshToken: z.string(),
	avatar: z.string(),
	teamId: z.string(),
	type: z.string(),
	expiresAt: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type SocialProfilesSchemaValues = z.infer<typeof SocialProfilesSchema>;

export const PublicSocialProfilesSchema = SocialProfilesSchema.pick({
	id: true,
	username: true,
	teamId: true,
	avatar: true,
	type: true,
	name: true,
});

export type PublicSocialProfilesSchemaValues = z.infer<
	typeof PublicSocialProfilesSchema
>;
