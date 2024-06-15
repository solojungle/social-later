import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const attachmentsRouter = createTRPCRouter({
	getAll: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { teamId } = input;

			// TODO: check auth

			const attachments = await ctx.db.attachment.findMany({
				where: {
					teamId,
				},
				include: {
					file: true,
				},
			});

			const attachmentsWithUrls = attachments.map((attachment) => {
				if (attachment?.file) {
					const { key, extension, type } = attachment.file;
					const baseUrl = `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
					const thumbnailBaseUrl = `https://${env.AWS_BUCKET_NAME}-thumbnails.s3.amazonaws.com/${key}`;

					return {
						...attachment,
						url: `${baseUrl}.${extension}`,
						thumbnail:
							type === "video"
								? `${thumbnailBaseUrl}.jpg`
								: `${thumbnailBaseUrl}.${extension}`,
					};
				}
				return attachment;
			});

			return attachmentsWithUrls;
		}),
});
