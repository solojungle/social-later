import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { stripe } from "@/server/services/stripe/client";
import { StripeSubscriptionStatus } from "@prisma/client";
import { z } from "zod";

export const teamRouter = createTRPCRouter({
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
        where: { id: input.id },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        stripePriceId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const customer = await stripe.customers.create({
        name: input.name,
      });

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        expand: ["latest_invoice.payment_intent"],
        items: [{ price: input.stripePriceId }],
        payment_behavior: "default_incomplete",
        payment_settings: {
          save_default_payment_method: "on_subscription",
        },
      });

      const team = await ctx.db.team.create({
        data: {
          image: `https://avatar.vercel.sh/${
            Math.floor(Math.random() * (1000000 - 0 + 1)) + 0
          }.png`,
          members: {
            create: {
              role: "OWNER",
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
          name: input.name,
          stripeCustomerId: customer.id,
          stripeSubscriptionId: subscription.id,
          stripeSubscriptionStatus: subscription.status,
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
        clientSecret:
          subscription?.latest_invoice.payment_intent.client_secret ?? "",
        team,
      };
    }),

  createViaEmbed: protectedProcedure
    .input(
      z.object({
        customer: z.string(),
        product: z.string(),
        subscription: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const team = await ctx.db.team.create({
        data: {
          image: `https://avatar.vercel.sh/${
            Math.floor(Math.random() * (1000000 - 0 + 1)) + 0
          }.png`,
          members: {
            create: {
              role: "OWNER",
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
          name: crypto.randomUUID(),
          stripeCustomerId: input.customer,
          stripeSubscriptionId: input.subscription,
          stripeSubscriptionStatus: "active",
        },
      });

      // Update stripe customer metadata with the team id
      await stripe.customers.update(input.customer, {
        metadata: {
          teamId: team.id,
        },
      });

      return team;
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
        select: {
          members: {
            select: {
              role: true, // Include the role field from UserOnTeam
              user: {
                select: {
                  email: true,
                  id: true,
                  image: true,
                  name: true,
                },
              },
            },
          },
        },
        where: { id: input.id },
      });

      return data?.members
        .filter((member) => member.user !== null)
        .map((member) => {
          return {
            ...member.user,
            email: member.user.email ?? "",
            image: member.user.image ?? "",
            name: member.user.name ?? "",
            role: member.role,
          };
        });
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        teamId: z.string(),
        userId: z.string(),
      }),
    )
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

      return ctx.db.userOnTeam.delete({
        where: {
          userId_teamId: {
            teamId: input.teamId,
            userId: input.userId,
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      TeamSchema.partial({
        image: true,
        name: true,
        url: true,
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
        data: {
          ...input,
          stripeSubscriptionStatus:
            input.stripeSubscriptionStatus as StripeSubscriptionStatus,
        },
        where: { id: input.id },
      });
    }),
});
