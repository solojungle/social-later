import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const metricsRouter = createTRPCRouter({
  // We have stored metrics for each channel in the database
  // This function will return the metrics for a specific channel
  getPostMetrics: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx }) => {
      // Get the channel id from the session
      // const { id } = input;

      // Get the metrics for the channel
      const metrics = await ctx.db.postMetrics.findMany();

      // Calculate the totals
      const totals = metrics.reduce(
        (acc, metric) => {
          acc.profileClicks.value += metric.profileClicks;
          acc.retweets.value += metric.retweets;
          acc.replies.value += metric.replies;
          acc.likes.value += metric.likes;
          acc.quotes.value += metric.quotes;
          acc.impressions.value += metric.impressions;
          acc.urlClicks.value += metric.urlClicks;

          return acc;
        },
        {
          followers: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          impressions: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          likes: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          profileClicks: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          quotes: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          replies: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          retweets: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
          urlClicks: {
            increase: {
              annually: 0,
              daily: 0,
              monthly: 0,
              weekly: 0,
            },
            value: 0,
          },
        },
      );

      return {
        metrics,
        totals,
      };
    }),
});
