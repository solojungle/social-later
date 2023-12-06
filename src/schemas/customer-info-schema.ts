import { z } from "zod";

// Define Zod schema for team
export const CustomerInfoSchema = z.object({
	id: z.string(),
	stripeCustomerId: z.string().optional(),
	stripeSubscriptionId: z.string().optional(),
	stripeSubscriptionStatus: z.string().optional(),
	teamId: z.string(),
});

export type CustomerInfoSchemaValues = z.infer<typeof CustomerInfoSchema>;
