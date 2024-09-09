import Stripe from "stripe";
import { z } from "zod";

import { env } from "@/env.mjs";
import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/services/stripe/client";

export const stripeRouter = createTRPCRouter({
	createCheckoutSession: protectedProcedure
		.input(
			z.object({
				lookupKey: z.string().optional(),
				priceId: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			if (input.lookupKey) {
				const prices = await stripe.prices.list({
					lookup_keys: [input.lookupKey],
					expand: ["data.product"],
				});

				const priceId = prices.data?.[0]?.id;
				if (!priceId) {
					throw new Error("No price found");
				}

				const session = await stripe.checkout.sessions.create({
					mode: "subscription",
					ui_mode: "embedded",
					allow_promotion_codes: true,
					line_items: [
						{
							price: priceId,
							quantity: 1,
						},
					],
					// TODO: replace this cardinal sin with a proper ENV var
					return_url: `${env.YOUTUBE_CALLBACK_URL}/checkout?sessionId={CHECKOUT_SESSION_ID}`,
				});

				return {
					clientSecret: session.client_secret,
				};
			}

			const session = await stripe.checkout.sessions.create({
				mode: "subscription",
				ui_mode: "embedded",
				allow_promotion_codes: true,
				line_items: [
					{
						price: input.priceId,
						quantity: 1,
					},
				],
				// TODO: replace this cardinal sin with a proper ENV var
				return_url: `${env.YOUTUBE_CALLBACK_URL}/checkout?sessionId={CHECKOUT_SESSION_ID}`,
			});

			return {
				clientSecret: session.client_secret,
			};
		}),

	getCheckoutSessionStatus: protectedProcedure
		.input(z.object({ sessionId: z.string() }))
		.query(async ({ input }) => {
			const session = await stripe.checkout.sessions.retrieve(input.sessionId, {
				expand: ["subscription"],
			});

			if (!session) {
				throw new Error("Session not found");
			}

			if (!session.customer_details) {
				throw new Error("No customer details");
			}

			const subscription = session.subscription as Stripe.Subscription;
			const productId = subscription.items?.data[0]?.price?.product as string;

			return {
				status: session.status as string,
				payment_status: session.payment_status as string,
				customer_email: session.customer_details.email as string,
				customer: session.customer as string,
				subscription: subscription.id as string,
				product: productId,
			};
		}),

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

	cancelSubscription: protectedProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.teamId },
			});

			if (!team) {
				throw new Error("Team not found");
			}

			if (!team.stripeSubscriptionId) {
				throw new Error("No Stripe subscription ID");
			}

			await stripe.subscriptions.update(team.stripeSubscriptionId, {
				cancel_at_period_end: true,
			});

			return true;
		}),

	resumeSubscription: protectedProcedure
		.input(z.object({ teamId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.teamId },
			});

			if (!team) {
				throw new Error("Team not found");
			}

			if (!team.stripeSubscriptionId) {
				throw new Error("No Stripe subscription ID");
			}

			await stripe.subscriptions.update(team.stripeSubscriptionId, {
				cancel_at_period_end: false,
			});

			return true;
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
				id: subscription.id,
				currentPeriodEnd: subscription.current_period_end,
				currentPeriodStart: subscription.current_period_start,
				defaultPaymentMethod: subscription.default_payment_method,
				productId: team.stripeProduct.stripeProductId,
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

			// Try to get the default payment method from the subscription
			let defaultPaymentMethod = null;
			if (team.stripeSubscriptionId) {
				const subscription = await stripe.subscriptions.retrieve(
					team.stripeSubscriptionId,
					{
						expand: ["default_payment_method"],
					},
				);
				defaultPaymentMethod =
					subscription.default_payment_method as Stripe.PaymentMethod;
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
						isDefault: paymentMethod.id === defaultPaymentMethod?.id,
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

	removePaymentMethod: protectedProcedure
		.input(z.object({ paymentMethodId: z.string(), teamId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.teamId },
			});

			if (!team?.stripeCustomerId) {
				throw new Error("Team not found or no Stripe customer Id");
			}

			const resp = await stripe.customers.listPaymentMethods(
				team.stripeCustomerId,
				{
					limit: 3,
				},
			);

			if (resp.data.length === 1) {
				throw new Error("Cannot remove last payment method");
			}

			// Get the subscription
			const subscription = await stripe.subscriptions.retrieve(
				team.stripeSubscriptionId,
				{
					expand: ["default_payment_method"],
				},
			);

			// Check if the payment method to be deleted is the default one
			const defaultPaymentMethod =
				subscription.default_payment_method as Stripe.PaymentMethod;

			if (defaultPaymentMethod?.id === input.paymentMethodId) {
				// Reassign the default payment method to the next one
				const nextDefaultPaymentMethod = resp.data.find(
					(paymentMethod) => paymentMethod.id !== input.paymentMethodId,
				);

				await stripe.subscriptions.update(team.stripeSubscriptionId, {
					default_payment_method: nextDefaultPaymentMethod?.id,
				});
			}

			// Now we can delete the payment method
			await stripe.paymentMethods.detach(input.paymentMethodId);
			return { success: true };
		}),

	setDefaultPaymentMethod: protectedProcedure
		.input(z.object({ teamId: z.string(), paymentMethodId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.teamId },
			});

			// try to update the subscription's default payment method first
			if (team?.stripeSubscriptionId) {
				await stripe.subscriptions.update(team.stripeSubscriptionId, {
					default_payment_method: input.paymentMethodId,
				});

				return { success: true };
			}

			// update the customer's default payment method
			if (!team?.stripeCustomerId) {
				throw new Error("Team not found or no Stripe customer Id");
			}

			await stripe.customers.update(team.stripeCustomerId, {
				invoice_settings: { default_payment_method: input.paymentMethodId },
			});

			return { success: true };
		}),

	changeSubscription: protectedProcedure
		.input(z.object({ teamId: z.string(), priceId: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const team = await ctx.db.team.findUnique({
				where: { id: input.teamId },
			});

			if (!team?.stripeSubscriptionId) {
				throw new Error("Team not found or no active subscription");
			}

			const subscription = await stripe.subscriptions.retrieve(
				team.stripeSubscriptionId,
			);

			await stripe.subscriptions.update(team.stripeSubscriptionId, {
				items: [
					{
						id: subscription.items.data[0]?.id,
						price: input.priceId,
					},
				],
			});

			return { success: true };
		}),

	// createNewSubscription: protectedProcedure
	// 	.input(z.object({ teamId: z.string(), priceId: z.string() }))
	// 	.mutation(async ({ ctx, input }) => {
	// 		const team = await ctx.db.team.findUnique({
	// 			where: { id: input.teamId },
	// 			include: { stripeProduct: true },
	// 		});

	// 		if (!team?.stripeCustomerId) {
	// 			throw new Error("Team not found or no Stripe customer ID");
	// 		}

	// 		// Check for existing subscription
	// 		if (team.stripeSubscriptionId) {
	// 			const existingSubscription = await stripe.subscriptions.retrieve(
	// 				team.stripeSubscriptionId,
	// 			);
	// 			if (
	// 				existingSubscription.status === "active" &&
	// 				!existingSubscription.cancel_at_period_end
	// 			) {
	// 				throw new Error("Active subscription already exists");
	// 			}
	// 		}

	// 		// Get current default payment method
	// 		const paymentMethods = await stripe.paymentMethods.list({
	// 			customer: team.stripeCustomerId,
	// 			type: "card",
	// 		});

	// 		if (paymentMethods.data.length === 0) {
	// 			throw new Error("No payment method found");
	// 		}

	// 		const defaultPaymentMethod = paymentMethods.data[0].id;

	// 		// Create new subscription
	// 		const subscription = await stripe.subscriptions.create({
	// 			customer: team.stripeCustomerId,
	// 			items: [{ price: input.priceId }],
	// 			default_payment_method: defaultPaymentMethod,
	// 		});

	// 		// Update team in database
	// 		await ctx.db.team.update({
	// 			where: { id: input.teamId },
	// 			data: {
	// 				stripeSubscriptionId: subscription.id,
	// 				stripeProductId: team.stripeProduct.id,
	// 			},
	// 		});

	// 		return { success: true, subscriptionId: subscription.id };
	// 	}),
});
