import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const awsRouter = createTRPCRouter({
	createPresignedURL: protectedProcedure
		.input(z.object({}))
		.mutation(async ({ ctx, input }) => {
			return "";
		}),
});
