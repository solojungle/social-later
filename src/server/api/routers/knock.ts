import { nanoid } from "nanoid";
import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "@/server/api/trpc";
import { knock } from "@/server/services/knock/client";

const NotificationFileSchema = z.object({
	name: z.string(),
	extension: z.string(),
	mime: z.string(),
	size: z.number(),
	url: z.string(),
});

export const knockRouter = createTRPCRouter({
	trigger: protectedProcedure
		.input(
			z.object({
				teamId: z.string(),
				messageType: z.enum(["join", "upload"]),
				message: z.string().optional(),
				files: z.array(NotificationFileSchema).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { teamId } = input;
			const { session, db } = ctx;

			try {
				// Get all the users in the team
				const users = await db.userOnTeam.findMany({
					where: {
						teamId: input.teamId,
					},
				});

				const userIds = users.map((user) => user.userId);

				// // Remove the current user from the list
				// const currentUserIndex = userIds.indexOf(session.user.id);
				// if (currentUserIndex !== -1) {
				// 	userIds.splice(currentUserIndex, 1);
				// }

				// if (!userIds.length) {
				// 	// No users to notify
				// 	return;
				// }

				await knock.workflows.trigger("in-app-message", {
					recipients: userIds,
					data: {
						type: input.messageType,
						message: input.message,
						files: input.files,
					},
					actor: session.user.id,
					cancellationKey: nanoid(),
					tenant: teamId,
				});
			} catch (error: any) {
				throw new Error(`Failed to trigger notification: ${error.message}`);
			}
		}),

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
});
