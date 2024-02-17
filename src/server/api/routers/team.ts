import { z } from "zod";

import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/services/stripe/client";

export const teamRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string(),
				stripePriceId: z.string(),
				internalProductId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const customer = await stripe.customers.create({
				name: input.name,
			});

			const subscription = await stripe.subscriptions.create({
				customer: customer.id,
				items: [{ price: input.stripePriceId }],
				payment_behavior: "default_incomplete",
				payment_settings: {
					save_default_payment_method: "on_subscription",
				},
				expand: ["latest_invoice.payment_intent"],
			});

			const team = await ctx.db.team.create({
				data: {
					name: input.name,
					image: `https://avatar.vercel.sh/${
						Math.floor(Math.random() * (1000000 - 0 + 1)) + 0
					}.png`,
					internalProductId: input.internalProductId,
					stripeCustomerId: customer.id,
					stripeSubscriptionId: subscription.id,
					stripeSubscriptionStatus: subscription.status,
					members: {
						create: {
							user: {
								connect: {
									id: ctx.session.user.id,
								},
							},
							role: "OWNER",
						},
					},
				},
			});

			// Update stripe customer metadata with the team id
			await stripe.customers.update(customer.id, {
				metadata: {
					teamId: team.id,
				},
			});

			// Make sure we have a payment intent
			if (
				!subscription?.latest_invoice ||
				typeof subscription?.latest_invoice === "string" ||
				!subscription?.latest_invoice.payment_intent ||
				typeof subscription?.latest_invoice.payment_intent === "string"
			) {
				throw new Error("No payment intent found");
			}

			return {
				team,
				clientSecret:
					subscription?.latest_invoice.payment_intent.client_secret ?? "",
			};
		}),

	delete: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.mutation(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
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

			const deletedTeam = await ctx.db.team.delete({
				where: { id: input.id },
			});

			const customerId = deletedTeam.stripeCustomerId;
			if (!customerId || customerId === "") {
				throw new Error("No customer id found");
			}

			// Now delete the customer from Stripe
			await stripe.customers.del(customerId);

			return deletedTeam;
		}),

	update: protectedProcedure
		.input(
			TeamSchema.partial({
				name: true,
				url: true,
				type: true,
				image: true,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
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

			return ctx.db.team.update({
				where: { id: input.id },
				data: input,
			});
		}),

	getMembers: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.query(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			const data = await ctx.db.team.findUnique({
				where: { id: input.id },
				select: {
					members: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
								},
							},
							role: true, // Include the role field from UserOnTeam
						},
					},
				},
			});

			return data?.members
				.filter((member) => member.user !== null)
				.map((member) => {
					return {
						...member.user,
						role: member.role.toLowerCase(),
						name: member.user.name ?? "",
						email: member.user.email ?? "",
						image: member.user.image ?? "",
					};
				});
		}),

	// TODO: Infer the id, and userId from their respective schemas
	addMember: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				userId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
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

			return ctx.db.team.update({
				where: { id: input.id },
				data: {
					members: {
						create: {
							user: {
								connect: {
									id: input.userId,
								},
							},
						},
					},
				},
			});
		}),
});
