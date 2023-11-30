import { TRPCError } from "@trpc/server";

import { UserSchema } from "@/schemas/user/user-schema";
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
				team: true,
			},
		});
		if (!teams) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `No teams belong to user with id '${ctx.session.user.id}'`,
			});
		}
		return teams;
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

	// modifyUserRole: protectedProcedure
	// 	.input({
	// 		teamId: TeamSchema.pick({ id: true }),
	// 		userId: UserSchema.pick({ id: true }),
	// 		role: UserSchema.pick({ role: true }),
	// 	})
	// 	.mutation(async ({ ctx, input }) => {
	// 		// Check if the current user has the necessary permissions to modify roles (you may customize this part)
	// 		const userOnTeam = await ctx.db.userOnTeam.findUnique({
	// 			where: { userId: ctx.session.user.id, teamId: input.teamId },
	// 		});

	// 		if (!userOnTeam || userOnTeam.role !== "OWNER") {
	// 			throw new TRPCError({
	// 				code: "UNAUTHORIZED",
	// 				message:
	// 					"You do not have permission to modify user roles for this team.",
	// 			});
	// 		}

	// 		// Update the user's role for the specified team
	// 		const updatedUserOnTeam = await ctx.db.userOnTeam.update({
	// 			where: { userId: input.userId, teamId: input.teamId },
	// 			data: { role: input.role },
	// 		});

	// 		if (!updatedUserOnTeam) {
	// 			throw new TRPCError({
	// 				code: "NOT_FOUND",
	// 				message: `No user with id '${input.userId}' in team with id '${input.teamId}'`,
	// 			});
	// 		}

	// 		return updatedUserOnTeam;
	// 	}),
});
