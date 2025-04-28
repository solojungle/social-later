/* eslint-disable no-await-in-loop */

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

import {
  accumulateHistoricalData,
  fetchAndProcessVideoViews,
  fetchHistoricalData,
  fetchHistoricViewsAndSubscribers,
  fetchRealtimeAnalytics,
  fetchRealTimeVideoData,
  fetchVideoMetrics,
  fetchVideosFromPlaylist,
  fetchYouTubeChannel,
  fillMissingDates,
  initializeYouTubeAnalyticsClient,
  initializeYouTubeDataClient,
  processLast10Videos,
  updateLast10VideosWithViews,
  verifyUserTeamMembership,
} from "./utils/youtube";

export const analyticsRouter = createTRPCRouter({
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

      const [historicalData, realtimeAnalytics, allUploadedVideos] =
        await Promise.all([
          fetchHistoricalData(youtubeAnalytics),
          fetchRealtimeAnalytics(youtubeDataClient),
          fetchVideosFromPlaylist({
            maxResults: 50,
            youtubeChannel,
            youtubeDataClient,
          }),
        ]);

      // Gets the videoIds of the last 50 uploaded videos, and filters out any null values
      const videoIds = allUploadedVideos?.items
        ?.map((video) => video?.snippet?.resourceId?.videoId)
        .filter(Boolean) as string[];

      const { videoViews, viewTypeResponse } = await fetchAndProcessVideoViews(
        youtubeAnalytics,
        videoIds,
      );

      const last10Videos = processLast10Videos(allUploadedVideos);
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
        last10Videos: updatedLast10Videos,
        realtimeAnalytics,
        videoViews,
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
        videoId: post.externalPostId,
        youtubeDataClient,
      });

      // Fetch historical data, from when video was first uploaded
      const startDate = new Date(post.scheduledFor).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];

      if (!startDate || !endDate) {
        return [];
      }

      const response = await fetchHistoricViewsAndSubscribers({
        endDate,
        startDate,
        videoId: [post.externalPostId],
        youtubeAnalytics,
      });

      if (!response.data?.rows) {
        return [];
      }

      // Transform historical data
      const data = response.data.rows.map((row) => ({
        date: row[0],
        subscribers_gained: Number(row[5]),
        views: Number(row[1]),
      }));

      return {
        historicalData: data,
        realtimeData: realtimeData.items?.[0]?.statistics ?? {},
      };
    }),

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
          comments: report.comments ?? "null",
          date: report.start_time,
          dislikes: report.dislikes ?? "null",
          id: String(report.id),
          likes: report.likes ?? "null",
          shares: report.shares ?? "null",
          subscribers_gained: report.subscribers_gained ?? "null",
          subscribers_lost: report.subscribers_lost ?? "null",
          views: report.views ?? "null",
          watch_time_minutes: report.watch_time_minutes ?? "null",
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
            const currentId = { date: curr.date, id: curr.id };
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
        channelId: youtubeChannel.username,
        maxResults: 10,
        order: "date",
        part: ["id"],
        type: ["video"],
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

      return { comparedVideos: sortedVideos, rank };
    }),
});
