import { TwitterApi } from "twitter-api-v2";
import { z } from "zod";

import { env } from "@/env.mjs";
import { TweetSchema } from "@/schemas/posts-schema";
import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client, v1client } from "@/server/services/twitter/client";

// This function will refresh the account if the token is expired
// will then return the client
async function getTwitterClientOrRefresh({
	updatedAt,
	expiresIn,
	accessToken,
	refreshToken,
	socialAccountId,
	ctx,
}: {
	updatedAt: Date;
	expiresIn: number;
	accessToken: string;
	refreshToken: string;
	socialAccountId: string;
	ctx: any;
}) {
	// Add expiresIn to createdAt to get the expiration date
	const expirationDate = new Date(updatedAt.getTime() + expiresIn * 1000);

	if (expirationDate <= new Date()) {
		// Refresh the token
		const {
			client: refreshedClient,
			accessToken: refreshedAccessToken,
			refreshToken: refreshedRefreshToken,
			expiresIn: refreshedExpiresIn,
		} = await client.refreshOAuth2Token(refreshToken);

		await ctx.db.twitterAccount.update({
			where: {
				id: socialAccountId,
			},
			data: {
				accessToken: refreshedAccessToken,
				refreshToken: refreshedRefreshToken,
				expiresIn: refreshedExpiresIn,
			},
		});

		return refreshedClient;
	}

	return new TwitterApi(accessToken);
}

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
					avatar: twitterAccount.avatar,
					teamId: twitterAccount.teamId,
				})) || []
			);
		}),

	deleteTweet: protectedProcedure
		.input(
			z.object({
				internalPostId: z.string(),
				accountId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { internalPostId, accountId } = input;

			// Check if the post exists
			const post = await ctx.db.post.findUnique({
				where: {
					id: internalPostId,
				},
			});

			if (!post) {
				throw new Error("Post does not exist");
			}

			// Make sure the user is apart of the team, and that the twitter account belongs to the team
			const twitterAccount = await ctx.db.twitterAccount.findUnique({
				where: {
					id: accountId,
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

			const loggedClient = await getTwitterClientOrRefresh({
				updatedAt: twitterAccount.updatedAt,
				expiresIn: twitterAccount.expiresIn,
				accessToken: twitterAccount.accessToken,
				refreshToken: twitterAccount.refreshToken,
				socialAccountId: twitterAccount.id,
				ctx,
			});

			const tweet = await loggedClient.v2.deleteTweet(post.externalPostId);

			return tweet;
		}),

	postTweet: protectedProcedure
		.input(TweetSchema)
		.mutation(async ({ ctx, input }) => {
			const { profileId: twitterAccountId } = input;

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

			const loggedClient = await getTwitterClientOrRefresh({
				updatedAt: twitterAccount.updatedAt,
				expiresIn: twitterAccount.expiresIn,
				accessToken: twitterAccount.accessToken,
				refreshToken: twitterAccount.refreshToken,
				socialAccountId: twitterAccount.id,
				ctx,
			});

			const hasMedia = "mediaId" in input;
			const hasContent = "content" in input;

			if (hasContent && hasMedia) {
				// Get the file from the database
				const file = await ctx.db.file.findUnique({
					where: {
						id: input.mediaId,
					},
				});

				if (!file) {
					throw new Error("File does not exist");
				}

				const response = await fetch(
					`https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.key}`,
				);
				const buffer = Buffer.from(await response.arrayBuffer());

				// Upload media to twitter via url
				const mediaId = await v1client.v1.uploadMedia(buffer, {
					mimeType: file.mime,
				});

				// Use media_ids to tweet
				const tweet = await loggedClient.v2.tweet(input.content, {
					media: {
						media_ids: [mediaId],
					},
				});

				return tweet;
			}
			if (hasMedia) {
				// Get the file from the database
				const file = await ctx.db.file.findUnique({
					where: {
						id: input.mediaId,
					},
				});

				if (!file) {
					throw new Error("File does not exist");
				}

				const response = await fetch(
					`https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.key}`,
				);
				const buffer = Buffer.from(await response.arrayBuffer());

				// Upload media to twitter via url
				const mediaId = await v1client.v1.uploadMedia(buffer, {
					mimeType: file.mime,
				});

				// Use media_ids to tweet
				const tweet = await loggedClient.v2.tweet({
					media: {
						media_ids: [mediaId],
					},
				});

				return tweet;
			}
			if (hasContent) {
				const tweet = await loggedClient.v2.tweet(input.content);

				return tweet;
			}

			throw new Error("You must provide content or media to tweet");
		}),
});
