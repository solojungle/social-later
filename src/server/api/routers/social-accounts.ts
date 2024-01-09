import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const socialAccountRouter = createTRPCRouter({
	getTwitterAccounts: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.query(async ({ ctx, input }) => {
			const { id: teamId } = input;

			// 1. Grab the information of the user submitting the form
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// 2. Grab all the twitter accounts for the team
			const twitterAccounts = await ctx.db.twitterAccount.findMany({
				where: {
					teamId,
				},
			});

			return twitterAccounts;
		}),
});
