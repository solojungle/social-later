import { auth } from "twitter-api-sdk";

import { env } from "@/env.mjs";

export const twitterUserOAuth = new auth.OAuth2User({
	client_id: env.TWITTER_CLIENT_ID,
	client_secret: env.TWITTER_CLIENT_SECRET,
	callback: `${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
	scopes: ["tweet.read", "users.read", "offline.access", "tweet.write"],
});
