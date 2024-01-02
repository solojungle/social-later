import { auth, Client } from "twitter-api-sdk";

import { env } from "@/env.mjs";

export const twitter = new Client(env.TWITTER_BEARER_TOKEN);
export const twitterAuth = new auth.OAuth2Bearer(env.TWITTER_BEARER_TOKEN);

export const twitterUserOAuth = new auth.OAuth2User({
	client_id: env.TWITTER_CLIENT_ID,
	client_secret: env.TWITTER_CLIENT_SECRET,
	callback: "http://127.0.0.1:3000/api/webhooks/twitter/callback",
	scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
});
