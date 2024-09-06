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
			const answer = await ctx.db.answer.upsert({
				where: {
					userId_questionId: {
						userId: ctx.session.user.id,
						questionId: input.questionId,
					},
				},
				create: {
					questionId: input.questionId,
					answer: input.answer,
					userId: ctx.session.user.id,
				},
				update: {
					answer: input.answer,
				},
			});

			return answer;
		}),

	getSurvey: protectedProcedure.query(async ({ ctx }) => {
		const survey = await ctx.db.survey.findFirst({
			include: {
				questions: true,
			},
		});

		if (!survey) {
			throw new Error("No survey found");
		}

		return survey;
	}),
});
