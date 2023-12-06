import { CustomerInfoSchema } from "@/schemas/customer-info-schema";
import { stripe } from "@/server/services/stripe/client";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const customerInfoRouter = createTRPCRouter({
	create: protectedProcedure
		.input(CustomerInfoSchema.pick({ teamId: true }))
		.mutation(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.teamId,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

			// Just need the customer id from Stripe
			const customer = await stripe.customers.create();

			await ctx.db.customerInfo.create({
				data: {
					stripeCustomerId: customer.id,
					teamId: input.teamId,
				},
			});
		}),

	delete: protectedProcedure
		.input(CustomerInfoSchema.pick({ teamId: true }))
		.mutation(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.teamId,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

			// Get the customer info
			const customerInfo = await ctx.db.customerInfo.findFirst({
				where: {
					teamId: input.teamId,
				},
			});

			if (!customerInfo || !customerInfo.stripeCustomerId) {
				throw new Error("No customer info found");
			}

			// Delete the customer from Stripe
			await stripe.customers.del(customerInfo.stripeCustomerId);

			// Delete the customer info
			await ctx.db.customerInfo.delete({
				where: {
					id: customerInfo.id,
				},
			});
		}),
});
