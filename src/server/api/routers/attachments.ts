import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { deleteS3Object } from "./utils/aws";

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
				return {
					...attachment,
					url: "",
					thumbnail: "",
				};
			});

			return attachmentsWithUrls;
		}),

	delete: protectedProcedure
		.input(z.array(z.string()))
		.mutation(async ({ ctx, input }) => {
			// If there exists a post that uses this attachment, we should not delete it
			const posts = await ctx.db.post.findFirst({
				where: {
					attachment: {
						some: {
							id: {
								in: input,
							},
						},
					},
				},
			});

			if (posts) {
				throw new Error("Cannot delete attachment that is in use");
			}

			const files = await ctx.db.file.findMany({
				where: {
					attachment: {
						some: {
							id: {
								in: input,
							},
						},
					},
				},
			});

			if (!files || files.length === 0) {
				throw new Error("Files not found");
			}

			const deletePromises = files.map(async (f) => {
				return deleteS3Object(f.key);
			});

			await Promise.allSettled(deletePromises);

			const deleteFiles = ctx.db.file.deleteMany({
				where: {
					id: {
						in: input,
					},
				},
			});

			return deleteFiles;
		}),
});
