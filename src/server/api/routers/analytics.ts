/* eslint-disable no-await-in-loop */

import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { fetchYouTubeChannel, verifyUserTeamMembership } from "./utils/youtube";

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
});
