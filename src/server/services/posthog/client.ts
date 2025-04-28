import { env } from "@/env.mjs";
import { PostHog } from "posthog-node";

export const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
});

await client.shutdown();
