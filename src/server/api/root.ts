import { postRouter } from "@/server/api/routers/posts";
import { teamRouter } from "@/server/api/routers/team";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

import { awsRouter } from "./routers/aws";
import { filesRouter } from "./routers/files";
import { invitationRouter } from "./routers/invitation";
import { metricsRouter } from "./routers/metrics";
import { oauth2Router } from "./routers/oauth2";
import { productsRouter } from "./routers/products";
import { socialProfilesRouter } from "./routers/social-profiles";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	post: postRouter,
	user: userRouter,
	team: teamRouter,
	invitation: invitationRouter,
	file: filesRouter,
	stripe: stripeRouter,
	oauth2: oauth2Router,
	aws: awsRouter,
	products: productsRouter,
	socials: socialProfilesRouter,
	metrics: metricsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
