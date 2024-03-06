import { z } from "zod";

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
			return ctx.db.post.findMany({
				where: {
					authorId: input.teamId,
				},
				orderBy: {
					createdAt: "desc",
				},
			});
		}),
});
