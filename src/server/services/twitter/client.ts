import { TwitterApi } from "twitter-api-v2";

import { env } from "@/env.mjs";

// TODO: Change to oauth2Client
export const client = new TwitterApi({
	clientId: env.TWITTER_CLIENT_ID,
	clientSecret: env.TWITTER_CLIENT_SECRET,
});

// TODO: Change to oauth1Client
export const v1client = new TwitterApi({
	appKey: env.TWITTER_APP_KEY,
	appSecret: env.TWITTER_APP_SECRET,
	accessToken: env.TWITTER_ACCESS_TOKEN,
	accessSecret: env.TWITTER_ACCESS_SECRET,
});
