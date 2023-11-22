import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.team.create({
				data: {
					name: input.name,
					image: `https://avatar.vercel.sh/${Math.floor(
						Math.random() * 10,
					)}.png`,
				},
			});
		}),
});
