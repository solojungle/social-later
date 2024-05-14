import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const metricsRouter = createTRPCRouter({
	// We have stored metrics for each channel in the database
	// This function will return the metrics for a specific channel
	getPostMetrics: protectedProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			// Get the channel id from the session
			const { id } = input;

			console.log(id);

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
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					profileClicks: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					retweets: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					replies: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					likes: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					quotes: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					impressions: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
					urlClicks: {
						value: 0,
						increase: {
							daily: 0,
							weekly: 0,
							monthly: 0,
							annually: 0,
						},
					},
				},
			);

			return {
				totals,
				metrics,
			};
		}),
});
