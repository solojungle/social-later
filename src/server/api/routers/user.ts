import { TRPCError } from "@trpc/server";

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
		return user;
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
});
