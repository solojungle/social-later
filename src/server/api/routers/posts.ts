import { z } from "zod";

import { env } from "@/env.mjs";
import { PostsSchema } from "@/schemas/posts-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { createAttachments } from "./utils/attachments";

export const postRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			PostsSchema.omit({
				id: true,
				attachment: true,
				status: true,
				published: true,
			}).extend({
				fileIds: z.array(z.string()).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { fileIds, scheduledFor, ...postData } = input;

			// Determine the status and published flag based on scheduledFor
			const status = scheduledFor ? "scheduled" : "published";
			const published = !scheduledFor;

			// Create the post
			const post = await ctx.db.post.create({
				data: {
					...postData,
					status,
					scheduledFor,
					published,
				},
			});

			// If there are files, create attachments
			if (fileIds && fileIds.length > 0) {
				const files = await ctx.db.file.findMany({
					where: {
						id: {
							in: fileIds,
						},
					},
				});

				if (!files || files.length !== fileIds.length) {
					throw new Error("One or more files do not exist");
				}

				await createAttachments(
					files.map((file) => ({
						teamId: post.authorId,
						postId: post.id,
						fileId: file.id,
					})),
				);
			}

			return post;
		}),

	delete: protectedProcedure
		.input(
			z.object({
				internalPostId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Get the post
			const post = await ctx.db.post.findFirst({
				where: {
					id: input.internalPostId,
				},
			});

			if (!post) {
				throw new Error("Post does not exist");
			}

			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: post.authorId,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

			// Delete the post
			return ctx.db.post.delete({
				where: {
					id: input.internalPostId,
				},
			});
		}),

	getAll: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
			}),
		)
		.query(async ({ ctx, input }) => {
			// Get posts and their attachments
			const posts = await ctx.db.post.findMany({
				where: {
					authorId: input.teamId,
				},
				include: {
					attachment: {
						include: {
							file: true,
						},
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});

			// Get the file for each attachment
			const postsWithFiles = await Promise.all(
				posts.map(async (post) => {
					const attachments = await ctx.db.attachment.findMany({
						where: { postId: post.id },
						include: { file: true },
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

					return {
						...post,
						attachment: attachmentsWithUrls,
					};
				}),
			);

			return postsWithFiles;
		}),
});
