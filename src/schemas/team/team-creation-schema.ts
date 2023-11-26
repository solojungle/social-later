import { z } from "zod";

import { TeamSchema } from "./team-schema";

// We infer the type of the schema here so we can use it in our form.
export const teamCreationFormSchema = TeamSchema.pick({ name: true });

export type TeamCreationFormValues = z.infer<typeof teamCreationFormSchema>;

// This can come from your database or API.
export const defaultValues: Partial<TeamCreationFormValues> = {
	name: "",
};
