import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				url: z.string(),
				image: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.team.create({
				data: {
					name: input.name,
					url: input.url,
					image: input.image,
				},
			});
		}),
});
