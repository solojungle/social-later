import { PostHog } from "posthog-node";

import { env } from "@/env.mjs";

export const client = new PostHog(env.NEXT_PUBLIC_POSTHOG_KEY, {
	host: env.NEXT_PUBLIC_POSTHOG_HOST,
});

await client.shutdown();
