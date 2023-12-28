import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const stripeRouter = createTRPCRouter({
	getPosts: protectedProcedure.query(async () => {}),
});
