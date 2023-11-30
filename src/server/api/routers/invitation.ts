import { InvitationSchema } from "@/schemas/invitation/invitation-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const invitationRouter = createTRPCRouter({
	create: protectedProcedure
		.input(InvitationSchema)
		.mutation(async ({ ctx, input }) => {}),

	update: protectedProcedure
		.input(InvitationSchema)
		.mutation(async ({ ctx, input }) => {}),
});
