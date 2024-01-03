import { auth, Client } from "twitter-api-sdk";

import { env } from "@/env.mjs";

export const twitter = new Client(env.TWITTER_BEARER_TOKEN);
export const twitterAuth = new auth.OAuth2Bearer(env.TWITTER_BEARER_TOKEN);

export const twitterUserOAuth = new auth.OAuth2User({
	client_id: env.TWITTER_CLIENT_ID,
	client_secret: env.TWITTER_CLIENT_SECRET,
	callback: `${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
	scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});
