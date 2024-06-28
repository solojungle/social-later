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
		.input(z.object({ attachmentIds: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			const attachments = await ctx.db.attachment.findMany({
				where: {
					id: {
						in: input.attachmentIds,
					},
				},
				include: {
					file: true,
				},
			});

			if (!attachments || attachments.length === 0) {
				throw new Error("Attachments not found");
			}

			// Remove any attachments with postIds that are not null
			const attachmentsWithoutPosts = attachments.filter(
				(a) => a.postId !== null,
			);

			if (attachmentsWithoutPosts.length > 0) {
				throw new Error("Cannot delete attachments that are attached to posts");
			}

			// Filter out duplicate files
			const uniqueAttachments = attachmentsWithoutPosts.filter(
				(value, index, self) =>
					self.findIndex((t) => t.file.key === value.file.key) === index,
			);

			const deletePromises = uniqueAttachments.map(async (a) =>
				deleteS3Object(a.file.key),
			);

			await Promise.allSettled(deletePromises);

			const deletedFiles = await ctx.db.file.deleteMany({
				where: {
					id: {
						in: uniqueAttachments.map((a) => a.fileId),
					},
				},
			});

			return deletedFiles;
		}),

	// This will create an attachment without a postId, i.e. the user is uploading an media file from the media library
	createIndependentAsset: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
				fileId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { teamId, fileId } = input;

			const attachment = await ctx.db.attachment.create({
				data: {
					teamId,
					fileId,
				},
			});

			return attachment;
		}),
});
