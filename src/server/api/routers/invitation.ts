import { InvitationSchema } from "@/schemas/invitation-schema";
import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { sendgrid } from "@/server/services/sendgrid/client";
import { z } from "zod";

export const invitationRouter = createTRPCRouter({
  accept: protectedProcedure
    .input(
      z.object({
        inviteCode: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { inviteCode } = input;

      // 1. Grab the invitation
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          expires: {
            gt: new Date(),
          },
          hasAccepted: false,
          hasExpired: false,
          token: inviteCode,
        },
      });

      if (invitation === null) {
        throw new Error("Invitation has expired or does not exist");
      }

      // 2. Grab the information of the user submitting the form
      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId: invitation.teamId,
          userId: ctx.session.user.id,
        },
      });

      // Check if the user is part of the team
      const isUserMemberOfTeam = isUserPartOfTeam !== null;
      if (isUserMemberOfTeam) {
        throw new Error("You are already apart of this team");
      }

      // 3. Create the userOnTeam
      const userOnTeam = await ctx.db.userOnTeam.create({
        data: {
          role: invitation.role,
          teamId: invitation.teamId,
          userId: ctx.session.user.id,
        },
      });

      // 4. Accept the invitation
      await ctx.db.invitation.update({
        data: {
          hasAccepted: true,
          hasExpired: true,
        },
        where: {
          id: invitation.id,
        },
      });

      return userOnTeam;
    }),

  create: protectedProcedure
    .input(
      InvitationSchema.pick({ email: true, role: true }).extend({
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, role, teamId } = input;

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
      // Check if the user already has an account
      const isUserAlreadySignedUp = await ctx.db.user.findFirst({
        where: {
          email,
        },
      });

      if (isUserAlreadySignedUp !== null) {
        // Check if the user is already a member of the team
        const isUserAlreadyMember = await ctx.db.userOnTeam.findFirst({
          where: {
            teamId,
            userId: isUserAlreadySignedUp.id,
          },
        });

        const isUserAlreadyMemberOfTeam = isUserAlreadyMember !== null;
        if (isUserAlreadyMemberOfTeam) {
          throw new Error("User is already a member of this team");
        }
      }

      // 3. Check if the user being invited has already been invited to the team
      const isUserAlreadyInvited = await ctx.db.invitation.findMany({
        where: {
          email,
          hasExpired: false,
          teamId,
        },
      });

      // First update all existing invitations to be expired
      const isUserAlreadyInvitedToTeam = isUserAlreadyInvited.length > 0;
      if (isUserAlreadyInvitedToTeam) {
        await ctx.db.invitation.updateMany({
          data: {
            hasExpired: true,
          },
          where: {
            email,
            hasExpired: false,
            teamId,
          },
        });
      }

      // 4. Create the invitation
      const invitation = await ctx.db.invitation.create({
        data: {
          email,
          expires: new Date(new Date().setDate(new Date().getDate() + 30)), // 30 days
          invitedById: ctx.session.user.id,
          role,
          teamId,
        },
      });

      // 5. Send the invitation email
      await sendgrid.send({
        from: "from@feedfrenzy.co",
        personalizations: [
          {
            dynamicTemplateData: {
              button_url: `https://feedfrenzy.co/invites?inviteCode=${invitation.token}`,
              contact_url: "https://feedfrenzy.co/contact",
              email,
              first_name: ctx.session.user.name?.split(" ")[0] || "Someone",
              sender_email: "from@feedfrenzy.co",
              sender_name: ctx.session.user.name,
            },
            from: {
              email: "from@feedfrenzy.co",
              name: "FeedFrenzy",
            },
            to: [
              {
                email,
              },
            ],
          },
        ],
        subject: "You've been invited to join a team on FeedFrenzy!",
        templateId: "d-6059f7514c6b43d39e30368022544f0b",
      });

      // 6. Return the invitation
      return invitation;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        invitationId: z.string(),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { invitationId, teamId } = input;

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

      // 2. Delete the invitation
      const deletedInvitation = await ctx.db.invitation.delete({
        where: {
          id: invitationId,
        },
      });

      return deletedInvitation;
    }),

  getPendingInvitations: protectedProcedure
    .input(TeamSchema.pick({ id: true }))
    .query(async ({ ctx, input }) => {
      const { id: teamId } = input;

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

      // 2. Grab all the pending invitations for the team
      const pendingInvitations = await ctx.db.invitation.findMany({
        where: {
          expires: {
            gt: new Date(),
          },
          hasExpired: false,
          teamId,
        },
      });

      return pendingInvitations.map((invitation) => ({
        ...invitation,
        role: invitation.role.toLowerCase(),
      }));
    }),
});
