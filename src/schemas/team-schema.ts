import { z } from "zod";

// Define Zod schema for team
export const TeamSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
	url: z.string(),
	type: z.string(),
	image: z.string(),
	imageFallbackInitials: z.string(),
});

export type TeamSchemaValues = z.infer<typeof TeamSchema>;

export const teamStoreDefaultValues: TeamSchemaValues = {
	id: "",
	name: "",
	url: "",
	type: "",
	image: "",
	imageFallbackInitials: "",
};
