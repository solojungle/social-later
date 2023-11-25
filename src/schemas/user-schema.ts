import { z } from "zod";

// Define Zod schema for team
export const UserSchema = z.object({
	id: z.string(),
	name: z.string().nullish(),
	email: z.string().email().nullish(),
	url: z.string(),
	type: z.string(),
	image: z.string().nullish(),
	imageFallbackInitials: z.string(),
});

export type UserSchemaValues = z.infer<typeof UserSchema>;

export const userStoreDefaultValues: UserSchemaValues = {
	id: "",
	name: "",
	email: "",
	url: "",
	type: "",
	image: "",
	imageFallbackInitials: "",
};
