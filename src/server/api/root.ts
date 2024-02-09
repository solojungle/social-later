import { postRouter } from "@/server/api/routers/posts";
import { teamRouter } from "@/server/api/routers/team";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

import { invitationRouter } from "./routers/invitation";
import { productsRouter } from "./routers/products";
import { socialProfilesRouter } from "./routers/social-profiles";
import { stripeRouter } from "./routers/stripe";
import { twitterRouter } from "./routers/twitter";

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
	stripe: stripeRouter,
	twitter: twitterRouter,
	products: productsRouter,
	socials: socialProfilesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
