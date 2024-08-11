import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				content: z.string().min(1),
				pageUrl: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			return ctx.db.feedback.create({
				data: {
					userId: ctx.session.user.id,
					...input,
				},
			});
		}),
});
