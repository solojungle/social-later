import { z } from "zod";

// Define Zod schema for team
export const TeamSchema = z.object({
	id: z.string(),
	name: z.string(),
	url: z.string(),
	type: z.string(),
	image: z.string(),
	imageFallbackInitials: z.string(),
});

export type TeamSchemaValues = z.infer<typeof TeamSchema>;

export const teamDefaultValues: TeamSchemaValues = {
	id: "",
	name: "",
	url: "",
	type: "",
	image: "",
	imageFallbackInitials: "",
};
