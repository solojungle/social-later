import { TwitterApi } from "twitter-api-v2";
import { z } from "zod";

import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/services/twitter/client";

export const socialProfilesRouter = createTRPCRouter({
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

			return (
				twitterAccounts.map((twitterAccount) => ({
					id: twitterAccount.id,
					username: twitterAccount.username,
					teamId: twitterAccount.teamId,
				})) || []
			);
		}),

	postTweet: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				content: z.string(),
				media: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id: twitterAccountId } = input;

			// Make sure the user is apart of the team, and that the twitter account belongs to the team
			const twitterAccount = await ctx.db.twitterAccount.findUnique({
				where: {
					id: twitterAccountId,
				},
			});

			if (!twitterAccount) {
				throw new Error("Twitter account does not exist");
			}

			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: twitterAccount.teamId,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Add expiresIn to createdAt to get the expiration date
			const expirationDate = new Date(
				twitterAccount.createdAt.getTime() + twitterAccount.expiresIn * 1000,
			);

			let loggedClient;

			if (expirationDate < new Date()) {
				// Refresh the token
				const {
					client: refreshedClient,
					accessToken,
					refreshToken,
					expiresIn,
				} = await client.refreshOAuth2Token(twitterAccount.refreshToken);

				await ctx.db.twitterAccount.update({
					where: {
						id: twitterAccountId,
					},
					data: {
						accessToken,
						refreshToken,
						expiresIn,
					},
				});

				loggedClient = refreshedClient;
			}

			if (!loggedClient) {
				loggedClient = new TwitterApi(twitterAccount.accessToken);
			}

			// Post the tweet
			const tweet = await loggedClient.v2.tweet(input.content);

			return tweet;
		}),
});
