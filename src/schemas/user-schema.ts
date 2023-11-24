import { z } from "zod";

// Define Zod schema for team
export const UserSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().email().optional(),
	url: z.string(),
	type: z.string(),
	image: z.string().optional(),
	imageFallbackInitials: z.string(),
});

export type UserSchemaValues = z.infer<typeof UserSchema>;

export const userDefaultValues: UserSchemaValues = {
	id: "",
	name: "",
	email: "",
	url: "",
	type: "",
	image: "",
	imageFallbackInitials: "",
};
