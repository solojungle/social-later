import { z } from "zod";

export const teamCreationFormSchema = z.object({
	name: z
		.string()
		.min(1, {
			message: "Name must be at least 1 character.",
		})
		.max(32, {
			message: "Name must not be longer than 32 characters.",
		}),
});

export type TeamCreationFormValues = z.infer<typeof teamCreationFormSchema>;

// This can come from your database or API.
export const defaultValues: Partial<TeamCreationFormValues> = {
	name: "",
};
