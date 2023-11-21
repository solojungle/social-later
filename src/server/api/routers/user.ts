import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
	getUserAndTeam: protectedProcedure.query(async ({ ctx }) => {
		const user = await ctx.db.user.findFirst({
			where: { id: ctx.session.user.id },
			select: {
				teams: true,
			},
		});
		if (!user) {
			throw new TRPCError({
				code: "NOT_FOUND",
				message: `No user with id '${ctx.session.user.id}'`,
			});
		}
		return user;
	}),
});
