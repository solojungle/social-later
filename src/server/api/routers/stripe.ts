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

	// getProducts: protectedProcedure.query(async () => {
	// 	const resp = await stripe.products.list({
	// 		limit: 3,
	// 		active: true,
	// 		expand: ["data.default_price"],
	// 	});

	// 	// Make the data more readable
	// 	const data = resp.data.map((product) => {
	// 		// Make sure we have a price and its an object
	// 		if (
	// 			!product.default_price ||
	// 			typeof product.default_price !== "object" ||
	// 			!product.default_price.unit_amount
	// 		) {
	// 			throw new Error("No price or price is not an object");
	// 		}

	// 		return {
	// 			id: product.id,
	// 			name: product.name,
	// 			image: product.images?.[0],
	// 			price: product.default_price.unit_amount / 100,
	// 			priceId: product.default_price.id,
	// 			currency: product.default_price.currency,
	// 		};
	// 	});

	// 	return data;
	// }),

	getSubscription: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.query(async ({ ctx, input }) => {
			// Include the subscription
			const team = await ctx.db.team.findUnique({
				where: { id: input.id },
				include: {
					stripeProduct: true,
				},
			});

			if (!team) {
				throw new Error("Team not found");
			}

			if (!team.stripeCustomerId) {
				throw new Error("No Stripe customer ID");
			}

			const subscription = await stripe.subscriptions.retrieve(
				team.stripeSubscriptionId,
			);

			return {
				currentPeriodEnd: subscription.current_period_end,
				currentPeriodStart: subscription.current_period_start,
				defaultPaymentMethod: subscription.default_payment_method,
				productName: team.stripeProduct.name ?? "",
				price: team.stripeProduct.price,
				priceFormatted: team.stripeProduct.priceFormatted,
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
