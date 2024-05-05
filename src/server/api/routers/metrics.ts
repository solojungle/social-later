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

			// Get the metrics for the channel
			const metrics = await ctx.db.postMetrics.findMany();

			return metrics;
		}),
});
