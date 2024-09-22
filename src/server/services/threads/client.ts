import { ThreadsAPI, ThreadsAPIConfig } from "threads-ts";

import { env } from "@/env.mjs";

const config: ThreadsAPIConfig = {
	clientId: env.THREADS_APP_ID,
	clientSecret: env.THREADS_APP_SECRET,
	redirectUri: `${env.CALLBACK_URL}/api/webhooks/threads/callback`,
	scope: [
		"threads_basic",
		"threads_content_publish",
		"threads_manage_replies",
		"threads_read_replies",
		"threads_manage_insights",
	],
};

export const threads = new ThreadsAPI(config);
