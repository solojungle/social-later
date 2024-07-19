import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { createAttachments } from "./utils/attachments";
import { deleteS3Object } from "./utils/aws";

export const attachmentsRouter = createTRPCRouter({
	getAll: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
				limit: z.number().min(8).max(32).nullish(),
				cursor: z.string().nullish(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const { teamId, cursor } = input;
			const limit = input.limit ?? 8;

			const countResult = await ctx.db.$queryRaw<
				{
					count: number;
				}[]
			>`SELECT COUNT(DISTINCT "fileId")
				FROM "Attachment"
				WHERE "teamId" = ${teamId}
			`;

			// Remove the 'n' at the end of the result to get number
			const totalCount = Number(countResult[0]?.count) ?? 0;

			const totalPages = Math.ceil(totalCount / limit);

			// TODO: check auth
			const attachments = await ctx.db.attachment.findMany({
				where: {
					teamId,
				},
				include: {
					file: true,
				},
				distinct: ["fileId"],
				take: limit + 1,
				cursor: cursor ? { id: cursor } : undefined,
				orderBy: {
					id: "asc",
				},
			});

			let nextCursor: typeof cursor | undefined;
			if (attachments.length > limit) {
				const nextItem = attachments.pop();
				nextCursor = nextItem!.id;
			}

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

			return { items: attachmentsWithUrls, nextCursor, totalPages, totalCount };
		}),

	delete: protectedProcedure
		.input(z.object({ attachmentIds: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			// We find the attachments based on their fileIds
			const attachments = await ctx.db.attachment.findMany({
				where: {
					fileId: {
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
				(a) => a.postId === null,
			);

			if (attachmentsWithoutPosts.length !== attachments.length) {
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

	create: protectedProcedure
		.input(
			z.array(
				z.object({
					teamId: z.string(),
					fileId: z.string(),
					postId: z.string().optional(),
				}),
			),
		)
		.mutation(async ({ input }) => {
			return createAttachments(input);
		}),
});
