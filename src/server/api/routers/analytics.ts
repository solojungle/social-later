/* eslint-disable no-await-in-loop */

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import {
	accumulateHistoricalData,
	fetchAndProcessLast10Videos,
	fetchAndProcessVideoViews,
	fetchHistoricalData,
	fetchHistoricViewsAndSubscribers,
	fetchRealtimeAnalytics,
	fetchRealTimeVideoData,
	fetchVideoMetrics,
	fetchYouTubeChannel,
	fillMissingDates,
	initializeYouTubeAnalyticsClient,
	initializeYouTubeDataClient,
	updateLast10VideosWithViews,
	verifyUserTeamMembership,
} from "./utils/youtube";

export const analyticsRouter = createTRPCRouter({
	getYouTubeAnalytics: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId } = input;
			const { db, session } = ctx;

			// Get the youtube channel, and verify the user is apart of the team
			const youtubeChannel = await fetchYouTubeChannel(db, profileId);
			await verifyUserTeamMembership(
				db,
				session.user.id,
				youtubeChannel.teamId,
			);

			const reports = await db.youTubeVideoReport.findMany({
				where: {
					profileId,
				},
			});

			// start_time, views, comments, likes, dislikes, shares, watch_time_minutes, subscribers_gained, subscribers_lost
			const analytics = reports
				.map((report) => ({
					id: String(report.id),
					date: report.start_time,
					views: report.views ?? "null",
					comments: report.comments ?? "null",
					likes: report.likes ?? "null",
					dislikes: report.dislikes ?? "null",
					shares: report.shares ?? "null",
					watch_time_minutes: report.watch_time_minutes ?? "null",
					subscribers_gained: report.subscribers_gained ?? "null",
					subscribers_lost: report.subscribers_lost ?? "null",
				}))
				.sort(
					(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
				);

			// Set the first value to the first report to 0 if its null
			if (
				analytics.length > 0 &&
				analytics[0] &&
				analytics[0].views === "null"
			) {
				analytics[0].views = "0";
				analytics[0].comments = "0";
				analytics[0].likes = "0";
				analytics[0].dislikes = "0";
				analytics[0].shares = "0";
				analytics[0].watch_time_minutes = "0";
				analytics[0].subscribers_gained = "0";
				analytics[0].subscribers_lost = "0";
			}

			// Update analytics with cumulative values
			for (let i = 1; i < analytics.length; i += 1) {
				const prev = analytics[i - 1];
				const curr = analytics[i];

				if (curr && prev) {
					if (curr.views === "null") {
						const currentId = { id: curr.id, date: curr.date };
						Object.assign(curr, prev);
						curr.id = currentId.id;
						curr.date = currentId.date;
					} else {
						curr.views = String(Number(prev.views) + Number(curr.views));
						curr.comments = String(
							Number(prev.comments) + Number(curr.comments),
						);
						curr.likes = String(Number(prev.likes) + Number(curr.likes));
						curr.dislikes = String(
							Number(prev.dislikes) + Number(curr.dislikes),
						);
						curr.shares = String(Number(prev.shares) + Number(curr.shares));
						curr.watch_time_minutes = String(
							Number(prev.watch_time_minutes) + Number(curr.watch_time_minutes),
						);
						curr.subscribers_gained = String(
							Number(prev.subscribers_gained) + Number(curr.subscribers_gained),
						);
						curr.subscribers_lost = String(
							Number(prev.subscribers_lost) + Number(curr.subscribers_lost),
						);
					}
				}
			}

			return analytics;
		}),

	rankVideoAmongLastTen: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
				videoId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId, videoId } = input;
			const { db } = ctx;

			// 1. Fetch the YouTube channel
			const youtubeChannel = await fetchYouTubeChannel(db, profileId);

			// 2. Initialize YouTube clients
			const youtubeDataClient = initializeYouTubeDataClient(youtubeChannel);
			const youtubeAnalytics = initializeYouTubeAnalyticsClient(youtubeChannel);

			// 3. Fetch the last 10 videos
			const videosResponse = await youtubeDataClient.search.list({
				part: ["id"],
				channelId: youtubeChannel.username,
				type: ["video"],
				order: "date",
				maxResults: 10,
			});

			const videoIds = videosResponse.data.items
				?.map((item) => item.id?.videoId)
				.filter(Boolean) as string[];

			// 4. Fetch metrics for all videos
			const allVideoMetrics = await fetchVideoMetrics(
				youtubeDataClient,
				youtubeAnalytics,
				videoIds,
			);

			// 5. Sort videos by views (you can change this metric or use a combination)
			const sortedVideos = allVideoMetrics.sort((a, b) => b.views - a.views);

			// 6. Find the rank of the given video
			const rank = sortedVideos.findIndex((video) => video.id === videoId) + 1;

			return { rank, comparedVideos: sortedVideos };
		}),

	combinedYouTubeAnalytics: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId } = input;
			const { db, session } = ctx;

			const youtubeChannel = await fetchYouTubeChannel(db, profileId);
			await verifyUserTeamMembership(
				db,
				session.user.id,
				youtubeChannel.teamId,
			);

			const youtubeAnalytics = initializeYouTubeAnalyticsClient(youtubeChannel);
			const youtubeDataClient = initializeYouTubeDataClient(youtubeChannel);

			const [historicalData, realtimeAnalytics, last10Videos] =
				await Promise.all([
					fetchHistoricalData(youtubeAnalytics),
					fetchRealtimeAnalytics(youtubeDataClient),
					fetchAndProcessLast10Videos(youtubeDataClient, youtubeChannel),
				]);

			const videoIds = last10Videos
				.map((video) => video.id)
				.filter(Boolean) as string[];

			const { videoViews, viewTypeResponse } = await fetchAndProcessVideoViews(
				youtubeAnalytics,
				videoIds,
			);

			const updatedLast10Videos = updateLast10VideosWithViews(
				last10Videos,
				viewTypeResponse,
			);

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const filledHistoricalData = fillMissingDates(historicalData, today);
			const accumulatedHistoricalData =
				accumulateHistoricalData(filledHistoricalData);

			return {
				historicalData: accumulatedHistoricalData,
				realtimeAnalytics,
				videoViews,
				last10Videos: updatedLast10Videos,
			};
		}),

	// Get analyrics for a specific video, including daily estimatedRevenue for the last two weeks, performance over time
	getSingleVideoAnalytics: protectedProcedure
		.input(
			z.object({
				postId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { postId } = input;
			const { db, session } = ctx;

			// Get the post, so we can find the published date, and use it to fetch historical data
			const post = await db.post.findUnique({
				where: {
					id: postId,
				},
			});

			if (!post) {
				return [];
			}

			const { profileId } = post;

			// Get the youtube channel, and verify the user is apart of the team
			const youtubeChannel = await fetchYouTubeChannel(db, profileId);
			await verifyUserTeamMembership(
				db,
				session.user.id,
				youtubeChannel.teamId,
			);

			const youtubeAnalytics = initializeYouTubeAnalyticsClient(youtubeChannel);
			const youtubeDataClient = initializeYouTubeDataClient(youtubeChannel);

			const { data: realtimeData } = await fetchRealTimeVideoData({
				youtubeDataClient,
				videoId: post.externalPostId,
			});

			// Fetch historical data, from when video was first uploaded
			const startDate = new Date(post.scheduledFor).toISOString().split("T")[0];
			const endDate = new Date().toISOString().split("T")[0];

			if (!startDate || !endDate) {
				return [];
			}

			const response = await fetchHistoricViewsAndSubscribers({
				youtubeAnalytics,
				startDate,
				endDate,
				videoId: [post.externalPostId],
			});

			if (!response.data?.rows) {
				return [];
			}

			// Transform historical data
			const data = response.data.rows.map((row) => ({
				date: row[0],
				views: Number(row[1]),
				subscribers_gained: Number(row[5]),
			}));

			return {
				historicalData: data,
				realtimeData: realtimeData.items?.[0]?.statistics ?? {},
			};
		}),
});
