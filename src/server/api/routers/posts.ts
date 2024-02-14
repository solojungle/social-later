import { z } from "zod";

import { PostsSchema } from "@/schemas/posts-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
	create: protectedProcedure
		.input(PostsSchema)
		.mutation(async ({ ctx, input }) => {
			if (input.media) {
				return ctx.db.post.create({
					data: {
						...input,
						media: {
							connect: input.media.map((media) => ({
								id: media.id,
							})),
						},
					},
				});
			}

			return ctx.db.post.create({
				data: {
					...input,
					media: {},
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
