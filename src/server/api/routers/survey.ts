import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const surveyRouter = createTRPCRouter({
  answer: protectedProcedure
    .input(
      z.object({
        answer: z.string().min(1),
        questionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const answer = await ctx.db.answer.upsert({
        create: {
          answer: input.answer,
          questionId: input.questionId,
          userId: ctx.session.user.id,
        },
        update: {
          answer: input.answer,
        },
        where: {
          userId_questionId: {
            questionId: input.questionId,
            userId: ctx.session.user.id,
          },
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
