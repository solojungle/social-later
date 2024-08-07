import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const surveyRouter = createTRPCRouter({
	answer: protectedProcedure
		.input(
			z.object({
				questionId: z.string(),
				answer: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const answer = await ctx.db.userAnswer.create({
				data: {
					userId: ctx.session.user.id,
					questionId: input.questionId,
					answer: input.answer,
				},
			});

			return answer;
		}),
});
