import { z } from "zod";

// Define Zod schema for team
export const SocialProfilesSchema = z.object({
  accessToken: z.string(),
  avatar: z.string(),
  createdAt: z.string(),
  expiresAt: z.string(),
  id: z.string(),
  name: z.string().optional().nullable(),
  refreshToken: z.string(),
  teamId: z.string(),
  type: z.string(),
  updatedAt: z.string(),
  username: z.string(),
});

export type SocialProfilesSchemaValues = z.infer<typeof SocialProfilesSchema>;

export const PublicSocialProfilesSchema = SocialProfilesSchema.pick({
  avatar: true,
  id: true,
  name: true,
  teamId: true,
  type: true,
  username: true,
});

export type PublicSocialProfilesSchemaValues = z.infer<
  typeof PublicSocialProfilesSchema
>;
