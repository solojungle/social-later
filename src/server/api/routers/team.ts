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
							role: "OWNER",
						},
					},
				},
			});
		}),

	delete: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.mutation(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

			return ctx.db.team.delete({
				where: { id: input.id },
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
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

			return ctx.db.team.update({
				where: { id: input.id },
				data: input,
			});
		}),

	getMembers: protectedProcedure
		.input(TeamSchema.pick({ id: true }))
		.query(async ({ ctx, input }) => {
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

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
								},
							},
							role: true, // Include the role field from UserOnTeam
						},
					},
				},
			});

			return data?.members
				.filter((member) => member.user !== null)
				.map((member) => {
					return {
						...member.user,
						role: member.role.toLowerCase(),
						name: member.user.name ?? "",
						email: member.user.email ?? "",
						image: member.user.image ?? "",
					};
				});
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
			// Check if the user is part of the team
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId: input.id,
					userId: ctx.session.user.id,
				},
			});

			if (!isUserPartOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

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
