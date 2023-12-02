import { z } from "zod";

import { InvitationSchema } from "@/schemas/invitation/invitation-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const invitationRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			InvitationSchema.extend({
				teamId: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { teamId, email, role } = input;

			// 1. Grab the information of the user submitting the form
			const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId,
					userId: ctx.session.user.id,
				},
			});

			// Check if the user is part of the team
			const isUserMemberOfTeam = isUserPartOfTeam !== null;
			if (!isUserMemberOfTeam) {
				throw new Error("You are not apart of this team");
			}

			// Check if the user is the owner of the team
			const isUserOwnerOfTeam = isUserPartOfTeam.role === "OWNER";
			if (!isUserOwnerOfTeam) {
				throw new Error("You are not an owner of this team");
			}

			// 2. Check if the user being invited is already a member of the team
			const isUserAlreadyMember = await ctx.db.userOnTeam.findFirst({
				where: {
					teamId,
					userId: ctx.session.user.id,
				},
			});

			const isUserAlreadyMemberOfTeam = isUserAlreadyMember !== null;
			if (isUserAlreadyMemberOfTeam) {
				throw new Error("User is already a member of this team");
			}

			// 3. Check if the user being invited has already been invited to the team
			const isUserAlreadyInvited = await ctx.db.invitation.findFirst({
				where: {
					teamId,
					email,
				},
			});

			const isUserAlreadyInvitedToTeam = isUserAlreadyInvited !== null;
			if (isUserAlreadyInvitedToTeam) {
				// First update the existing invitation to be expired, and then re-invite the user
				await ctx.db.invitation.update({
					where: {
						id: isUserAlreadyInvited.id,
					},
					data: {
						hasExpired: true,
					},
				});
			}

			// 4. Create the invitation
			const invitation = await ctx.db.invitation.create({
				data: {
					teamId,
					email,
					role,
				},
			});
		}),

	update: protectedProcedure
		.input(InvitationSchema)
		.mutation(async ({ ctx, input }) => {}),
});
