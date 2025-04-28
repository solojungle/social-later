import { postRouter } from "@/server/api/routers/posts";
import { teamRouter } from "@/server/api/routers/team";
import { userRouter } from "@/server/api/routers/user";
import { createTRPCRouter } from "@/server/api/trpc";

import { analyticsRouter } from "./routers/analytics";
import { attachmentsRouter } from "./routers/attachments";
import { awsRouter } from "./routers/aws";
import { feedbackRouter } from "./routers/feedback";
import { filesRouter } from "./routers/files";
import { invitationRouter } from "./routers/invitation";
import { knockRouter } from "./routers/knock";
import { metricsRouter } from "./routers/metrics";
import { oauth2Router } from "./routers/oauth2";
import { openaiRouter } from "./routers/openai";
import { productsRouter } from "./routers/products";
import { socialProfilesRouter } from "./routers/social-profiles";
import { threadsRouter } from "./routers/socials/threads";
import { stripeRouter } from "./routers/stripe";
import { surveyRouter } from "./routers/survey";
import { usageRouter } from "./routers/usage";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  analytics: analyticsRouter,
  attachment: attachmentsRouter,
  aws: awsRouter,
  feedback: feedbackRouter,
  file: filesRouter,
  invitation: invitationRouter,
  metrics: metricsRouter,
  notification: knockRouter,
  oauth2: oauth2Router,
  openai: openaiRouter,
  post: postRouter,
  products: productsRouter,
  socials: socialProfilesRouter,
  stripe: stripeRouter,
  survey: surveyRouter,
  team: teamRouter,
  threads: threadsRouter,
  usage: usageRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
