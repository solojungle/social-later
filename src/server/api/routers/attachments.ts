import { FileType, Prisma } from "@prisma/client";
import { z } from "zod";

import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { createAttachments } from "./utils/attachments";
import { deleteS3Object } from "./utils/aws";

// Define supported file types and sort fields
const FileTypeFilter = z.enum(["image", "video", "all"]);
const SortField = z.enum(["name", "size", "createdAt"]);
const SortOrder = z.enum(["asc", "desc"]);

export const attachmentsRouter = createTRPCRouter({
	getAll: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
				searchQuery: z.string().optional(),
				fileType: FileTypeFilter.optional(),
				sortBy: SortField.optional().default("createdAt"),
				sortOrder: SortOrder.optional().default("desc"),
				page: z.number().min(1).default(1),
				// pageSize: z.number().min(8).max(100).default(8),
			}),
		)
		.query(async ({ ctx, input }) => {
			const {
				teamId,
				searchQuery,
				fileType,
				sortBy,
				sortOrder,
				page,
				// pageSize,
			} = input;

			// Lets hardcode the pageSize for now, we can add it back later if needed
			const pageSize = 8;

			const skip = Math.max(0, (page - 1) * pageSize);

			// Build where conditions
			const whereConditions: Prisma.AttachmentWhereInput = {
				teamId,
				file: {
					AND: [
						// Search condition
						searchQuery
							? {
									OR: [
										{ name: { contains: searchQuery, mode: "insensitive" } },
									],
							  }
							: {},
						// File type filter
						fileType && fileType !== "all"
							? {
									type: fileType as FileType,
							  }
							: {},
					],
				},
			};

			// Prisma does not support distinct with count.
			const totalCount = await ctx.db.attachment
				.groupBy({
					by: ["fileId"],
					where: whereConditions,
				})
				.then((groups) => groups.length);

			const totalPages = Math.ceil(totalCount / pageSize);

			// Build sort object
			const orderBy: Prisma.AttachmentOrderByWithRelationInput = (() => {
				switch (sortBy) {
					case "name":
						return { file: { name: sortOrder } };
					case "size":
						return { file: { size: sortOrder } };
					case "createdAt":
					default:
						return { createdAt: sortOrder };
				}
			})();

			// Fetch attachments
			const attachments = await ctx.db.attachment.findMany({
				where: whereConditions,
				include: {
					file: true,
				},
				distinct: ["fileId"],
				take: pageSize,
				skip,
				orderBy,
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

			const files = attachmentsWithUrls.map((a) => {
				return {
					...a.file,
					thumbnail: a.thumbnail,
					url: a.url,
				};
			});

			return {
				items: files,
				pagination: {
					page,
					pages: totalPages,
					items: totalCount,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 0,
				},
			};
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
