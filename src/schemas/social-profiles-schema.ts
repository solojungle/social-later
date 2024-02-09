import { z } from "zod";

// Define Zod schema for team
export const SocialProfilesSchema = z.object({
	id: z.string(),
	username: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
	expiresIn: z.number(),
	teamId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type SocialProfilesSchemaValues = z.infer<typeof SocialProfilesSchema>;

export const PublicSocialProfilesSchema = SocialProfilesSchema.pick({
	id: true,
	username: true,
	teamId: true,
});

export type PublicSocialProfilesSchemaValues = z.infer<
	typeof PublicSocialProfilesSchema
>;
