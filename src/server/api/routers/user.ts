import { UserRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { UserSchema } from "@/schemas/user-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
	getUser: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
		});
		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `No user with id '${ctx.session.user.id}'`,
			});
		}

		// We need to convert null values to empty strings because,
		// prisma is the only part of the stack that has null values.
		// and it is preferable to have empty strings in the rest of the stack.
		return {
			...user,
			name: user.name ?? "",
			email: user.email ?? "",
			emailVerified: user.emailVerified ?? "",
			image: user.image ?? "",
		};
	}),

	getTeams: protectedProcedure.query(async ({ ctx }) => {
		const teams = await ctx.db.userOnTeam.findMany({
			where: { userId: ctx.session.user.id },
			select: {
				team: {
					select: {
						id: true,
						name: true,
						url: true,
						image: true,
						stripeSubscriptionStatus: true,
					},
				},
			},
		});
		if (!teams) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `No teams belong to user with id '${ctx.session.user.id}'`,
			});
		}

		// Remove the "team" key from the response
		// and return only the teams
		return teams.map((team) => team.team);
	}),

	updateUser: protectedProcedure
		.input(UserSchema.partial())
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.update({
				where: { id: ctx.session.user.id },
				data: input,
			});
			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `No user with id '${ctx.session.user.id}'`,
				});
			}
			return user;
		}),

	updateUserRole: protectedProcedure
		.input(
			z.object({
				userId: z.string(),
				teamId: z.string(),
				role: z.nativeEnum(UserRole),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// TODO: Check if the user is an owner of the team
			const user = await ctx.db.userOnTeam.update({
				where: {
					userId_teamId: { userId: input.userId, teamId: input.teamId },
				},
				data: { role: input.role },
			});
			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: `No user with id '${input.userId}'`,
				});
			}
			return user;
		}),
});
