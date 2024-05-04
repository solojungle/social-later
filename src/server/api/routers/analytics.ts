/* eslint-disable no-await-in-loop */
import { TwitterApi } from "twitter-api-v2";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/services/twitter/client";

// This function will refresh the account if the token is expired
// will then return the client
async function getTwitterClientOrRefresh({
	updatedAt,
	expiresAt,
	accessToken,
	refreshToken,
	socialAccountId,
	ctx,
}: {
	updatedAt: Date;
	expiresAt: Date;
	accessToken: string;
	refreshToken: string;
	socialAccountId: string;
	ctx: any;
}) {
	if (expiresAt <= new Date()) {
		// TODO: this is giving me issues constantly
		const {
			client: refreshedClient,
			accessToken: refreshedAccessToken,
			refreshToken: refreshedRefreshToken,
			expiresIn: refreshedExpiresIn,
		} = await client.refreshOAuth2Token(refreshToken);

		await ctx.db.socialProfile.update({
			where: {
				id: socialAccountId,
			},
			data: {
				accessToken: refreshedAccessToken,
				refreshToken: refreshedRefreshToken,
				expiresAt: new Date(updatedAt.getTime() + refreshedExpiresIn),
			},
		});

		return refreshedClient;
	}

	return new TwitterApi(accessToken);
}

export const analyticsRouter = createTRPCRouter({
	// A cron job that will run every 24 hours to get the analytics of the last 24 hours of every account in the database
	populateAnalytics: protectedProcedure.query(async ({ ctx }) => {
		// Get all the accounts
		const accounts = await ctx.db.socialProfile.findMany({
			where: {
				type: "twitter",
			},
		});

		// Loop through all the accounts, get the tweets from the last 30 days, and save/update the metrics for each post
		for (const account of accounts) {
			// Get the client
			const loggedClient = await getTwitterClientOrRefresh({
				updatedAt: account.updatedAt,
				expiresAt: account.expiresAt,
				accessToken: account.accessToken,
				refreshToken: account.refreshToken,
				socialAccountId: account.id,
				ctx,
			});

			// Get the tweets from the last 30 days
			const tweets = await loggedClient.v2.get("tweets", {
				"tweet.fields": "public_metrics",
				expansions: "attachments.media_keys",
				"user.fields": "public_metrics",
				"media.fields": "public_metrics",
				max_results: 100,
				start_time: new Date(
					Date.now() - 30 * 24 * 60 * 60 * 1000,
				).toISOString(),
				end_time: new Date().toISOString(),
				ids: account.posts.map((post) => post.id),
			});

			// Save the analytics
			await ctx.db.analytics.create({
				data: {
					accountId: account.id,
					analytics,
				},
			});
		}

		return true;
	}),
});
