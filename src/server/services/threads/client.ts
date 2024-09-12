import { env } from "@/env.mjs";
import { ThreadsAPI, ThreadsAPIConfig } from "@/server/threads-sdk";

const config: ThreadsAPIConfig = {
	clientId: env.THREADS_APP_ID,
	clientSecret: env.THREADS_APP_SECRET,
	redirectUri: `${env.CALLBACK_URL}/api/webhooks/threads/callback`,
	scope: ["threads_basic"],
};

export const threads = new ThreadsAPI(config);
