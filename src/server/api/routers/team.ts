import { TeamSchema } from "@/schemas/team/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const teamRouter = createTRPCRouter({
	create: protectedProcedure
		.input(TeamSchema.pick({ name: true }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.team.create({
				data: {
					name: input.name,
					image: `https://avatar.vercel.sh/${
						Math.floor(Math.random() * (1000000 - 0 + 1)) + 0
					}.png`,
					members: {
						create: {
							user: {
								connect: {
									id: ctx.session.user.id,
								},
							},
						},
					},
				},
			});
		}),
});
