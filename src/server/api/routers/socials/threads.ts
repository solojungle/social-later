/* eslint-disable no-await-in-loop */

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { threads } from "@/server/services/threads/client";

export const threadsRouter = createTRPCRouter({
	getPostInsights: protectedProcedure
		.input(
			z.object({
				postId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { postId } = input;
			const { db, session } = ctx;

			const post = await db.post.findUnique({
				where: {
					id: postId,
				},
			});

			if (!post) {
				throw new Error("Post does not exist");
			}

			const isUserPartOfTeam = await db.userOnTeam.findFirst({
				where: {
					teamId: post.authorId,
					userId: session.user.id,
				},
			});
			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			const profile = await db.socialProfile.findUnique({
				where: {
					id: post.profileId,
				},
			});

			if (!profile || !profile.accessToken) {
				throw new Error("Social profile does not exist");
			}

			threads.setAccessToken(profile?.accessToken);

			const insights = await threads.getMediaInsights({
				mediaId: post.externalPostId,
				metrics: ["views", "likes", "replies", "reposts", "quotes"],
			});

			// Handle cases where insights might be undefined or not an array
			if (!Array.isArray(insights)) {
				const defaultInsights = [
					"views",
					"likes",
					"replies",
					"reposts",
					"quotes",
				];
				const defaultStats = defaultInsights.reduce(
					(acc: { [key: string]: number }, name) => {
						acc[name] = 0;
						return acc;
					},
					{},
				);
				return defaultStats;
			}

			const stats = insights.reduce((acc: any, insight: any) => {
				const name: string = insight?.name ?? ""; // Safely access name
				const values = insight?.values ?? [];
				const value = values?.[0]?.value ?? 0; // Safely access value
				if (name) {
					acc[name] = value; // Add name-value pair to the accumulator object
				}
				return acc;
			}, {});

			return stats;
		}),
	getUserInsights: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId } = input;
			const { db, session } = ctx;

			const socialProfile = await db.socialProfile.findUnique({
				where: {
					id: profileId,
				},
			});

			if (!socialProfile || !socialProfile.accessToken) {
				throw new Error("Social profile does not exist");
			}

			const isUserPartOfTeam = await db.userOnTeam.findFirst({
				where: {
					teamId: socialProfile.teamId,
					userId: session.user.id,
				},
			});
			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			threads.setAccessToken(socialProfile?.accessToken);

			// TODO: Revisit total post views

			const userInsights = await threads.getUserInsights({
				userId: "me",
				metric: [
					"views",
					"likes",
					"replies",
					"reposts",
					"quotes",
					"followers_count",
				],
				options: {},
			});

			// Handle cases where insights might be undefined or not an array
			if (!Array.isArray(userInsights)) {
				const defaultInsights = [
					"views",
					"likes",
					"replies",
					"reposts",
					"quotes",
					"followers_count",
				];
				const defaultStats = defaultInsights.reduce(
					(acc: { [key: string]: number }, name) => {
						acc[name] = 0;
						return acc;
					},
					{},
				);
				return defaultStats;
			}

			const stats = userInsights.reduce((acc: any, insight: any) => {
				const name: string = insight?.name ?? ""; // Safely access name
				// every value except views has total_value
				if (insight?.total_value) {
					acc[name] = insight?.total_value.value;
					return acc;
				}
				const values = insight?.values ?? [];
				const value = values?.[0]?.value ?? 0; // Safely access value
				acc[name] = value; // Add name-value pair to the accumulator object
				return acc;
			}, {});

			return stats;
		}),

	last10Posts: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId } = input;
			const { db, session } = ctx;

			const socialProfile = await db.socialProfile.findUnique({
				where: {
					id: profileId,
				},
			});

			if (!socialProfile || !socialProfile.accessToken) {
				throw new Error("Social profile does not exist");
			}

			const isUserPartOfTeam = await db.userOnTeam.findFirst({
				where: {
					teamId: socialProfile.teamId,
					userId: session.user.id,
				},
			});
			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			threads.setAccessToken(socialProfile?.accessToken);

			const posts = await threads.getUserThreads({
				userId: "me",
				fields: [
					"id",
					"text",
					"media_type",
					"permalink",
					"is_quote_post",
					"timestamp",
					"thumbnail_url",
				],
				options: {
					limit: 10,
				},
			});

			return posts;
		}),

	createThreadsPost: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
				mediaType: z.enum(["TEXT", "IMAGE", "VIDEO", "CAROUSEL"]),
				media: z.any(),
				text: z.string().optional(),
				scheduledTime: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { profileId } = input;

			// Make sure the user is apart of the team, and that the account belongs to the team
			const socialProfile = await ctx.db.socialProfile.findUnique({
				where: {
					id: profileId,
				},
			});
			if (!socialProfile) {
				throw new Error("Social profile does not exist");
			}

			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: socialProfile.teamId,
					userId: ctx.session.user.id,
				},
			});
			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			threads.setAccessToken(socialProfile.accessToken);

			let containerId = "";
			switch (input.mediaType) {
				case "TEXT":
					containerId = await threads.createMediaContainer({
						userId: "me",
						mediaType: "TEXT",
						text: input.text,
					});
					break;
				case "IMAGE":
					containerId = await threads.createMediaContainer({
						userId: "me",
						mediaType: "IMAGE",
						mediaUrl: input.media.url,
						text: input.text,
					});
					break;
				case "VIDEO":
					containerId = await threads.createMediaContainer({
						userId: "me",
						mediaType: "VIDEO",
						mediaUrl: input.media.url,
						text: input.text,
					});
					break;
				case "CAROUSEL":
					// containerId = await threads.createCarouselItemContainer({
					// 	userId: "me",
					// 	mediaType: "CAROUSEL",
					// 	mediaIds: input.mediaIds,
					// });
					break;
				default:
					throw new Error("Invalid media type");
			}

			const sleep = (ms: number | undefined) =>
				new Promise((resolve) => {
					setTimeout(resolve, ms);
				});

			// Wait up to 5 minutes, checking every minute
			for (let i = 0; i < 5; i += 1) {
				const { status } = await threads.getMediaContainerStatus(containerId);
				if (status === "FINISHED") break;
				await sleep(60000);
			}

			const result = await threads.publishMediaContainer({
				userId: "me",
				creationId: containerId,
			});

			return result;
		}),
});
