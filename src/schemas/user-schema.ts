import { z } from "zod";

// Define Zod schema for team
export const UserSchema = z.object({
	id: z.string(),
	name: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
	email: z.string().email(),
	url: z
		.string()
		.min(1, {
			message: "Name must be at least 1 characters.",
		})
		.max(48, {
			message: "Name must not be longer than 48 characters.",
		}),
	type: z.string(),
	image: z.string(),
});

export type UserSchemaValues = z.infer<typeof UserSchema>;

export const userStoreDefaultValues: UserSchemaValues = {
	id: "",
	name: "",
	email: "",
	url: "",
	type: "",
	image: "",
};

export const TeamMembers = UserSchema.pick({
	id: true,
	name: true,
	email: true,
	image: true,
}).extend({
	role: z.string(),
});

export type TeamMembersSchemaValues = z.infer<typeof TeamMembers>;
