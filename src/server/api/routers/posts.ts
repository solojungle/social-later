import { z } from "zod";

import { env } from "@/env.mjs";
import { PostsSchema } from "@/schemas/posts-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
	create: protectedProcedure
		.input(PostsSchema.omit({ id: true }))
		.mutation(async ({ ctx, input }) => {
			// Because we have a file we must link the file to the post
			// as an attachment
			if (input.fileId) {
				const file = await ctx.db.file.findUnique({
					where: {
						id: input.fileId,
					},
				});

				if (!file) {
					throw new Error("File does not exist");
				}

				// While we create the post we must remove the fileId
				// from the input object
				// eslint-disable-next-line no-param-reassign
				delete input.fileId;

				const post = await ctx.db.post.create({
					data: {
						...input,
					},
				});

				await ctx.db.attachment.create({
					data: {
						postId: post.id,
						fileId: file.id,
					},
				});

				return post;
			}

			return ctx.db.post.create({
				data: {
					...input,
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
					const attachment = await ctx.db.attachment.findFirst({
						where: {
							postId: post.id,
						},
						include: {
							file: true,
						},
					});

					// Add a url to make it easier to access the file
					if (attachment?.file) {
						return {
							...post,
							attachment,
							url: `https://${env.AWS_BUCKET_NAME}.s3.amazonaws.com/${attachment.file.key}`,
						};
					}

					return {
						...post,
						attachment,
					};
				}),
			);

			return postsWithFiles;
		}),
});
