import { z } from "zod";

import { UserSchema } from "./user-schema";

// We infer the type of the schema here so we can use it in our form.
export const userUpdateSchema = UserSchema.pick({
	name: true,
	image: true,
	url: true,
});

export type UserUpdateValues = z.infer<typeof userUpdateSchema>;

// This can come from your database or API.
export const defaultValues: Partial<UserUpdateValues> = {
	name: "",
};
