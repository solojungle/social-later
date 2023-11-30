import { z } from "zod";

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
			const data = await ctx.db.team.findUnique({
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

			// Remove the null values from the array
			const formattedMembers = data?.members.map((member) => {
				return {
					...member.user,
					name: member.user.name ?? "",
					email: member.user.email ?? "",
					image: member.user.image ?? "",
					role: member.user.role.toLowerCase(), // Capitalize only changes the first letter, so we need to lowercase it beforehand
				};
			});

			return formattedMembers;
		}),

	// TODO: Infer the id, and userId from their respective schemas
	addMember: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				userId: z.string(),
			}),
		)
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
