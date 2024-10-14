import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const usageRouter = createTRPCRouter({
	find: protectedProcedure
		.input(
			z.object({
				teamId: z.string().min(1),
			}),
		)
		.query(async ({ input, ctx }) => {
			const { teamId } = input;
			const { db } = ctx;

			const profiles = await db.socialProfile.findMany({
				where: {
					teamId,
				},
			});

			// Get a unique set of all the types of platforms
			const platforms = Array.from(new Set(profiles.map((p) => p.type)));

			// Count posts that were made today
			const usage = await db.post.groupBy({
				by: "socialType",
				where: {
					authorId: teamId,
					createdAt: {
						gte: new Date(new Date().setHours(0, 0, 0, 0)),
					},
				},
				_count: {
					socialType: true,
				},
			});

			// Get all attachments uploaded, get the file, get the file size, and sum them up
			const attachments = await db.attachment.findMany({
				include: {
					file: true,
				},
				where: {
					teamId,
				},
			});

			const totalSize = attachments.reduce(
				(acc, attachment) => acc + attachment.file.size,
				0,
			);

			return {
				platforms,
				usage,
				totalSize,
			};
		}),
});
