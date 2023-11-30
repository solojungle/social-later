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

	update: protectedProcedure
		.input(
			TeamSchema.partial({
				name: true,
				url: true,
				type: true,
				image: true,
				imageFallbackInitials: true,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db.team.update({
				where: { id: input.id },
				data: input,
			});
		}),

	getMembers: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.query(async ({ ctx, input }) => {
			return ctx.db.team.findUnique({
				where: { id: input.id },
				select: {
					members: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
									email: true,
									image: true,
									role: true,
								},
							},
						},
					},
				},
			});
		}),

	addMember: protectedProcedure
		.input(TeamSchema.pick({ id: true, userId: true }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db.team.update({
				where: { id: input.id },
				data: {
					members: {
						create: {
							user: {
								connect: {
									id: input.userId,
								},
							},
						},
					},
				},
			});
		}),
});
