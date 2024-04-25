import { SocialProfileType } from "@prisma/client";
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

async function uploadMediaToTwitter({
	ctx,
	input,
}: {
	input: { mediaIds: string[] };
	ctx: any;
}) {
	// Get the files from the database
	const files = await ctx.db.file.findMany({
		where: {
			id: {
				in: input.mediaIds,
			},
		},
	});

	if (!files) {
		throw new Error("Files do not exist");
	}

	// Get all the files from AWS
	const buffers = await Promise.all(
		files.map(async (file: any) => {
			const response = await fetch(
				`https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${file.key}.${file.extension}`,
			);
			return Buffer.from(await response.arrayBuffer());
		}),
	);

	// Upload media to twitter via url
	const mediaIds = await Promise.all(
		buffers.map(async (buffer, index) => {
			const mediaId = await v1client.v1.uploadMedia(buffer, {
				mimeType: files[index]?.mime, // Add null check
			});
			return mediaId;
		}),
	);

	return mediaIds;
}

export const socialProfilesRouter = createTRPCRouter({
	getSocialProfiles: protectedProcedure
		.input(
			TeamSchema.pick({ id: true }).extend({
				type: z.nativeEnum(SocialProfileType).optional(),
			}),
		)
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
			const profiles = await ctx.db.socialProfile.findMany({
				where: {
					teamId,
				},
			});

			return (
				profiles.map((profile) => ({
					id: profile.id,
					username: profile.username,
					avatar: profile.avatar,
					name: profile.name,
					teamId: profile.teamId,
					type: profile.type,
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
			const twitterAccount = await ctx.db.socialProfile.findUnique({
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
				expiresAt: twitterAccount.expiresAt,
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
			const twitterAccount = await ctx.db.socialProfile.findUnique({
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
				expiresAt: twitterAccount.expiresAt,
				accessToken: twitterAccount.accessToken,
				refreshToken: twitterAccount.refreshToken,
				socialAccountId: twitterAccount.id,
				ctx,
			});

			const hasMedia = "mediaIds" in input;
			const hasContent = "content" in input;

			if (hasContent && hasMedia) {
				// Upload media to twitter via url
				const mediaIds = await uploadMediaToTwitter({
					ctx,
					input,
				});

				// Use media_ids to tweet
				const tweet = await loggedClient.v2.tweet(input.content, {
					media: {
						media_ids: mediaIds,
					},
				});

				return tweet;
			}
			if (hasMedia) {
				// Upload media to twitter via url
				const mediaIds = await uploadMediaToTwitter({
					ctx,
					input,
				});

				// Use media_ids to tweet
				const tweet = await loggedClient.v2.tweet({
					media: {
						media_ids: mediaIds,
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
