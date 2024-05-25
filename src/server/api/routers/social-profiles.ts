import { youtube } from "@googleapis/youtube";
import { SocialProfileType } from "@prisma/client";
import { TwitterApi } from "twitter-api-v2";
import { z } from "zod";

import { env } from "@/env.mjs";
import { TweetSchema } from "@/schemas/posts-schema";
import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client, v1client } from "@/server/services/twitter/client";
import { getYTClientAuth } from "@/server/services/youtube/client";

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

async function getVideoFileBuffer({ ctx, input }: { ctx: any; input: any }) {
	// Get the files from the database
	const video = await ctx.db.file.findUnique({
		where: {
			id: {
				in: input.videoId,
			},
		},
	});

	if (!video) {
		throw new Error("Video does not exist");
	}

	// Get all the files from AWS
	const buffer = await fetch(
		`https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${video.key}.${video.extension}`,
	);

	return Buffer.from(await buffer.arrayBuffer());
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

	uploadYouTubeVideo: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
				videoUrl: z.string(),
				title: z.string(),
				description: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId: ytAccountId } = input;

			// Make sure the user is apart of the team, and that the twitter account belongs to the team
			const ytAccount = await ctx.db.socialProfile.findUnique({
				where: {
					id: ytAccountId,
				},
			});

			if (!ytAccount) {
				throw new Error("YouTube account does not exist");
			}

			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: ytAccount.teamId,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			const clientAuth = getYTClientAuth({
				accessToken: ytAccount.accessToken,
				refreshToken: ytAccount.refreshToken,
				expiresAt:
					ytAccount.expiresAt.getTime() - new Date(Date.now()).getTime(),
			});

			const yt = youtube({
				version: "v3",
				auth: clientAuth,
			});

			const response = await yt.videos.insert({
				part: ["snippet", "status"],
				requestBody: {
					snippet: {
						title: input.title,
						description: input.description,
					},
					status: {
						privacyStatus: "public",
					},
				},
				media: {
					body: getVideoFileBuffer({ ctx, input }),
				},
			});

			return response;
		}),

	// getYtAnalytics: protectedProcedure
	// 	.input(z.object({ profileId: z.string() }))
	// 	.query(async ({ ctx, input }) => {
	// 		const { profileId: ytAccountId } = input;

	// 		// Make sure the user is apart of the team, and that the twitter account belongs to the team
	// 		const ytAccount = await ctx.db.socialProfile.findUnique({
	// 			where: {
	// 				id: ytAccountId,
	// 			},
	// 		});

	// 		if (!ytAccount) {
	// 			throw new Error("YouTube account does not exist");
	// 		}

	// 		const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
	// 			where: {
	// 				teamId: ytAccount.teamId,
	// 				userId: ctx.session.user.id,
	// 			},
	// 		});

	// 		if (!isUserPartOfTeam) {
	// 			throw new Error("You are not apart of this team");
	// 		}

	// 		const clientAuth = getYTClientAuth({
	// 			accessToken: ytAccount.accessToken,
	// 			refreshToken: ytAccount.refreshToken,
	// 			expiresAt:
	// 				ytAccount.expiresAt.getTime() - new Date(Date.now()).getTime(),
	// 		});

	// 		// const ytAnalytics = youtubeAnalytics_v2();

	// 		try {
	// 			const yt = youtube({
	// 				version: "v3",
	// 				auth: clientAuth,
	// 			});

	// 			const channels = await yt.channels.list({
	// 				part: ["contentDetails"],
	// 				mine: true,
	// 			});

	// 			const uploadPlaylistIds = channels.data.items?.map(
	// 				(item) => item.contentDetails?.relatedPlaylists?.uploads,
	// 			);

	// 			if (!uploadPlaylistIds) {
	// 				throw new Error("Could not find upload playlist");
	// 			}

	// 			const uploadedVideo = await yt.playlistItems.list({
	// 				part: ["snippet"],
	// 				playlistId: uploadPlaylistIds[0],
	// 			});

	// 			const uploadedVideoIds = uploadedVideo.data.items
	// 				?.map((item) => item.snippet?.resourceId?.videoId) // Get videoId from resourceId
	// 				.filter((id) => typeof id === "string"); // Filter out non-string values

	// 			if (!uploadedVideoIds || uploadedVideoIds.length === 0) {
	// 				throw new Error("No uploaded videos found");
	// 			}

	// 			const uploadedVideoStats = await yt.videos.list({
	// 				part: ["statistics", "contentDetails", "snippet"],
	// 				id: uploadedVideoIds.filter(
	// 					(id) => id !== null && id !== undefined,
	// 				) as string[],
	// 			});

	// 			return uploadedVideoStats;
	// 		} catch (err) {
	// 			console.log(err);
	// 		}

	// 		return "";
	// 	}),
});
