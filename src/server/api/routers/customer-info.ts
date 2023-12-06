import { CustomerInfoSchema } from "@/schemas/customer-info-schema";
import { stripe } from "@/server/services/stripe/client";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const customerInfoRouter = createTRPCRouter({
	create: protectedProcedure
		.input(CustomerInfoSchema.pick({ teamId: true }))
		.mutation(async ({ ctx, input }) => {
			// Just need the customer id from Stripe
			const customer = await stripe.customers.create();

			await ctx.db.customerInfo.create({
				data: {
					stripeCustomerId: customer.id,
					teamId: input.teamId,
				},
			});
		}),
});
