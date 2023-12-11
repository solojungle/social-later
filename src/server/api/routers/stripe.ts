import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/services/stripe/client";

export const stripeRouter = createTRPCRouter({
	createSetupIntent: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.mutation(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.id },
			});

			if (!team) {
				throw new Error("Team not found");
			}

			if (!team.stripeCustomerId) {
				throw new Error("No Stripe customer ID");
			}

			const resp = await stripe.setupIntents.create({
				customer: team.stripeCustomerId,
			});

			return {
				clientSecret: resp.client_secret,
			};
		}),

	getPaymentMethods: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.query(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.id },
			});

			if (!team) {
				throw new Error("Team not found");
			}

			if (!team.stripeCustomerId) {
				throw new Error("No Stripe customer ID");
			}

			const resp = await stripe.customers.listPaymentMethods(
				team.stripeCustomerId,
				{
					limit: 3,
				},
			);

			// Make the data more readable
			const data = resp.data.map((paymentMethod) => {
				if (paymentMethod.type === "card") {
					return {
						id: paymentMethod.id,
						brand: paymentMethod.card?.brand,
						type: paymentMethod.card?.funding,
						last4: paymentMethod.card?.last4,
						expMonth: paymentMethod.card?.exp_month,
						expYear: paymentMethod.card?.exp_year,
					};
				}

				return {
					id: paymentMethod.id,
					brand: paymentMethod.type,
					type: null,
					last4: null,
					expMonth: null,
					expYear: null,
				};
			});

			return data;
		}),
});
