import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { knock } from "@/server/services/knock/client";
import { nanoid } from "nanoid";
import { z } from "zod";

const NotificationFileSchema = z.object({
  extension: z.string(),
  mime: z.string(),
  name: z.string(),
  size: z.number(),
  url: z.string(),
});

export const knockRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        await knock.users.identify(input.userId);
      } catch (error: any) {
        throw new Error(`Failed to create user: ${error.message}`);
      }
    }),

  trigger: protectedProcedure
    .input(
      z.object({
        files: z.array(NotificationFileSchema).optional(),
        message: z.string().optional(),
        messageType: z.enum(["join", "upload"]),
        teamId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { teamId } = input;
      const { db, session } = ctx;

      try {
        // Get all the users in the team
        const users = await db.userOnTeam.findMany({
          where: {
            teamId: input.teamId,
          },
        });

        const userIds = users.map((user) => user.userId);

        // Remove the current user from the list
        const currentUserIndex = userIds.indexOf(session.user.id);
        if (currentUserIndex !== -1) {
          userIds.splice(currentUserIndex, 1);
        }

        if (!userIds.length) {
          // No users to notify
          return;
        }

        await knock.workflows.trigger("in-app-message", {
          actor: session.user.id,
          cancellationKey: nanoid(),
          data: {
            files: input.files,
            message: input.message,
            type: input.messageType,
          },
          recipients: userIds,
          tenant: teamId,
        });
      } catch (error: any) {
        throw new Error(`Failed to trigger notification: ${error.message}`);
      }
    }),
});
