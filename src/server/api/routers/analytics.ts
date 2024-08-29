/* eslint-disable no-await-in-loop */

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import {
	fetchHistoricalData,
	fetchHistoricViewsAndSubscribers,
	fetchYouTubeChannel,
	initializeYouTubeAnalyticsClient,
	initializeYouTubeDataClient,
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

	// getYouTubeAnalyticsUsingReports: protectedProcedure
	// 	.input(
	// 		z.object({
	// 			profileId: z.string(),
	// 		}),
	// 	)
	// 	.query(async ({ ctx, input }) => {
	// 		const { profileId } = input;
	// 		const { db, session } = ctx;

	// 		// Get the youtube channel, and verify the user is apart of the team
	// 		const youtubeChannel = await fetchYouTubeChannel(db, profileId);
	// 		await verifyUserTeamMembership(
	// 			db,
	// 			session.user.id,
	// 			youtubeChannel.teamId,
	// 		);

	// 		const youtubeAnalytics = initializeYouTubeAnalyticsClient(youtubeChannel);

	// 		// Fetch historical data
	// 		const startDate = new Date(
	// 			new Date().setFullYear(new Date().getFullYear() - 1),
	// 		)
	// 			.toISOString()
	// 			.split("T")[0];
	// 		const endDate = new Date().toISOString().split("T")[0];

	// 		const historicalRequest = {
	// 			dimensions: "day",
	// 			startDate,
	// 			endDate,
	// 			ids: "channel==MINE",
	// 			metrics:
	// 				"views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
	// 			sort: "day",
	// 		};

	// 		const historicalResponse =
	// 			await youtubeAnalytics.reports.query(historicalRequest);

	// 		if (!historicalResponse.data?.rows) {
	// 			return [];
	// 		}

	// 		// Transform historical data
	// 		const historicalData = historicalResponse.data.rows.map((row) => ({
	// 			date: row[0],
	// 			views: Number(row[1]),
	// 			watch_time_minutes: Number(row[2]),
	// 			// average_view_duration: Number(row[3]),
	// 			// average_view_percentage: Number(row[4]),
	// 			subscribers_gained: Number(row[5]),
	// 		}));

	// 		// Fetch realtime data
	// 		const youtubeDataClient = initializeYouTubeDataClient(youtubeChannel);
	// 		const realtimeResponse = await youtubeDataClient.channels.list({
	// 			part: ["statistics"],
	// 			mine: true,
	// 		});

	// 		if (realtimeResponse?.data?.items && historicalData.length > 0) {
	// 			const { viewCount, subscriberCount } =
	// 				realtimeResponse.data.items[0].statistics;

	// 			// Calculate difference in days between last historical date and today
	// 			const lastHistoricalDate = new Date(
	// 				historicalData[historicalData.length - 1].date,
	// 			);

	// 			const today = new Date();
	// 			today.setHours(0, 0, 0, 0);

	// 			const diffDays = Math.floor(
	// 				(today - lastHistoricalDate) / (1000 * 60 * 60 * 24),
	// 			);

	// 			// Fill in missing days with 0 values
	// 			for (let i = 0; i < diffDays - 1; i += 1) {
	// 				const nextDate = new Date(lastHistoricalDate);
	// 				nextDate.setDate(lastHistoricalDate.getDate() + i + 1);
	// 				const nextDateString = nextDate.toISOString().split("T")[0];

	// 				historicalData.push({
	// 					date: nextDateString,
	// 					views: 0,
	// 					watch_time_minutes: 0,
	// 					average_view_duration: 0,
	// 					average_view_percentage: 0,
	// 					subscribers_gained: 0,
	// 				});
	// 			}

	// 			// Add realtime data
	// 			historicalData.push({
	// 				date: today.toISOString().split("T")[0],
	// 				views: Number(viewCount),
	// 				watch_time_minutes: 0,
	// 				average_view_duration: 0,
	// 				average_view_percentage: 0,
	// 				subscribers_gained: Number(subscriberCount),
	// 			});
	// 		}

	// 		// Calculate cumulative values
	// 		for (let i = 1; i < historicalData.length - 1; i += 1) {
	// 			historicalData[i].views += historicalData[i - 1].views;
	// 			historicalData[i].watch_time_minutes +=
	// 				historicalData[i - 1].watch_time_minutes;
	// 			historicalData[i].subscribers_gained +=
	// 				historicalData[i - 1].subscribers_gained;
	// 		}

	// 		return historicalData;
	// 	}),

	combinedYouTubeAnalytics: protectedProcedure
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

			const youtubeAnalytics = initializeYouTubeAnalyticsClient(youtubeChannel);
			const youtubeDataClient = initializeYouTubeDataClient(youtubeChannel);

			const historicalData = await fetchHistoricalData(youtubeAnalytics);

			// Fetch real-time data
			const realtimeResponse = await youtubeDataClient.channels.list({
				part: ["statistics"],
				mine: true,
			});

			let realtimeAnalytics = {
				viewCount: 0,
				subscriberCount: 0,
			};

			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const endDate = today.toISOString().split("T")[0];

			if (realtimeResponse?.data?.items) {
				const item = realtimeResponse.data.items[0];

				if (!item || !item.statistics) {
					return {
						historicalData,
						realtimeAnalytics,
						videoViews: {
							shorts: 0,
							long: 0,
							stories: 0,
							liveStreams: 0,
							other: 0,
						},
						last10Videos: [],
					};
				}

				const { viewCount, subscriberCount } = item.statistics;
				realtimeAnalytics = {
					viewCount: Number(viewCount),
					subscriberCount: Number(subscriberCount),
				};

				if (historicalData.length > 0) {
					const lastItem = historicalData[historicalData.length - 1];

					if (!lastItem) {
						return {
							historicalData,
							realtimeAnalytics,
							videoViews: {
								shorts: 0,
								long: 0,
								stories: 0,
								liveStreams: 0,
								other: 0,
							},
							last10Videos: [],
						};
					}

					const lastHistoricalDate = new Date(lastItem.date);
					const diffDays = Math.floor(
						(today.getTime() - lastHistoricalDate.getTime()) /
							(1000 * 60 * 60 * 24),
					);

					for (let i = 0; i < diffDays - 1; i += 1) {
						const nextDate = new Date(lastHistoricalDate);
						nextDate.setDate(lastHistoricalDate.getDate() + i + 1);
						const nextDateString = nextDate.toISOString().split("T")[0];

						historicalData.push({
							date: nextDateString,
							views: 0,
							watch_time_minutes: 0,
							average_view_duration: 0,
							average_view_percentage: 0,
							subscribers_gained: 0,
						});
					}

					historicalData.push({
						date: today.toISOString().split("T")[0],
						views: realtimeAnalytics.viewCount,
						watch_time_minutes: 0,
						average_view_duration: 0,
						average_view_percentage: 0,
						subscribers_gained: realtimeAnalytics.subscriberCount,
					});

					for (let i = 1; i < historicalData.length - 1; i += 1) {
						const prevData = historicalData[i - 1];
						const currData = historicalData[i];

						if (currData && prevData) {
							currData.views += prevData.views;
							currData.watch_time_minutes += prevData.watch_time_minutes;
							currData.subscribers_gained += prevData.subscribers_gained;
						}
					}
				}
			}

			// Fetch video views by type
			const uploadPlaylistId = `UU${youtubeChannel.username.slice(2)}`;
			const videos = await youtubeDataClient.playlistItems.list({
				part: ["snippet"],
				playlistId: uploadPlaylistId,
			});

			// Fetch the last 10 videos
			const last10Videos =
				videos.data.items?.slice(0, 10)?.map((video) => ({
					id: video?.snippet?.resourceId?.videoId,
					views: 0,
					thumbnail:
						video?.snippet?.thumbnails?.medium?.url ??
						video?.snippet?.thumbnails?.default?.url,
					title: video?.snippet?.title,
					url: `https://www.youtube.com/watch?v=${video?.snippet?.resourceId?.videoId}`,
				})) || [];

			const videoIds = videos.data.items?.map(
				(video) => video?.snippet?.resourceId?.videoId,
			);

			const videoViews = {
				shorts: 0,
				long: 0,
				stories: 0,
				liveStreams: 0,
				other: 0,
			};

			if (videoIds) {
				const viewTypeResponse = await youtubeAnalytics.reports.query({
					ids: "channel==MINE",
					startDate: "2019-01-01",
					endDate,
					metrics: "views",
					dimensions: "video,creatorContentType",
					filters: `video==${videoIds.join(",")}`,
				});

				// For last 10 videos we're adding views
				last10Videos.forEach((video) => {
					const videoView = viewTypeResponse.data?.rows?.find(
						(row) => row[0] === video.id,
					);

					if (videoView) {
						// eslint-disable-next-line no-param-reassign
						video.views = Number(videoView[2]);
					}
				});

				viewTypeResponse.data?.rows?.forEach((row) => {
					const viewType = row[1].toLowerCase();
					const views = Number(row[2]);

					switch (viewType) {
						case "shorts":
							videoViews.shorts += views;
							break;
						case "videoondemand":
							videoViews.long += views;
							break;
						case "story":
							videoViews.stories += views;
							break;
						case "livestream":
							videoViews.liveStreams += views;
							break;
						default:
							videoViews.other += views;
							break;
					}
				});
			}

			return {
				historicalData,
				realtimeAnalytics,
				videoViews,
				last10Videos,
			};
		}),

	// Get analyrics for a specific video, including daily estimatedRevenue for the last two weeks, performance over time
	getSingleVideoAnalytics: protectedProcedure
		.input(
			z.object({
				profileId: z.string(),
				postId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { profileId, postId } = input;
			const { db, session } = ctx;

			// Get the youtube channel, and verify the user is apart of the team
			const youtubeChannel = await fetchYouTubeChannel(db, profileId);
			await verifyUserTeamMembership(
				db,
				session.user.id,
				youtubeChannel.teamId,
			);

			// Get the post, so we can find the published date, and use it to fetch historical data
			const post = await db.post.findUnique({
				where: {
					id: postId,
				},
			});

			if (!post) {
				return [];
			}

			const youtubeAnalytics = initializeYouTubeAnalyticsClient(youtubeChannel);

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
				videoId: post.externalPostId,
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

			return data;
		}),
});
