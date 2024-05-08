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
	populateChannelAnalytics: protectedProcedure.query(async ({ ctx }) => {
		// Get all the accounts
		const accounts = await ctx.db.socialProfile.findMany({
			where: {
				type: "twitter",
			},
		});

		const profile = accounts[0];

		if (!profile) {
			return null;
		}

		const loggedClient = await getTwitterClientOrRefresh({
			updatedAt: profile.updatedAt,
			expiresAt: profile.expiresAt,
			accessToken: profile.accessToken,
			refreshToken: profile.refreshToken,
			socialAccountId: profile.id,
			ctx,
		});

		// Get all the posts within the last 30 days, and update them with the latest stats
		const posts = await ctx.db.post.findMany({
			where: {
				profileId: profile.id,
				createdAt: {
					gte: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
				},
			},
		});

		console.log(posts);

		// Get the stats of the posts
		const postIds = posts.map((post) => post.externalPostId);

		console.log(postIds);

		try {
			// Get the stats of the posts

			const { data: postStats } = await loggedClient.v2.userTimeline("12", {
				exclude: "replies",
			});
			// const { data: postStats } = await loggedClient.v2.tweets(postIds, {
			// 	"tweet.fields": "public_metrics",
			// 	// "tweet.fields": "public_metrics,organic_metrics,non_public_metrics",
			// });

			console.log("postStats: ", postStats);

			return postStats;
		} catch (err) {
			console.log(err);
		}

		// const { data } = await loggedClient.v2.me({
		// 	"user.fields": "public_metrics",
		// });

		// const stats = data.public_metrics;

		// if (!stats) {
		// 	return null;
		// }

		// // Now push into the database
		// const resp = await ctx.db.channelMetrics.create({
		// 	data: {
		// 		profileId: account.id, // Add the 'profile' property
		// 		followers: stats.followers_count || 0,
		// 		tweets: stats.tweet_count || 0,
		// 		likes: stats.like_count || 0,
		// 	},
		// });

		// return resp;
	}),
});
