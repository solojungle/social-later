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

			const insights = await threads.getUserInsights({
				userId: "me",
				metrics: [
					"views",
					"likes",
					"replies",
					"reposts",
					"quotes",
					"followers_count",
				],
			});

			// Handle cases where insights might be undefined or not an array
			if (!Array.isArray(insights)) {
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

			const stats = insights.reduce((acc: any, insight: any) => {
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

	createThreadsPost: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
				content: z.string(),
				mediaIds: z.array(z.string()).optional(),
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

			const postId = await threads.createMediaContainer({
				userId: "me",
				mediaType: "TEXT",
				text: input.content,
			});

			const result = await threads.publishMediaContainer({
				userId: "me",
				creationId: postId,
			});

			return result;
		}),
});
