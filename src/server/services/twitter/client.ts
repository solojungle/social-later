import { auth, Client } from "twitter-api-sdk";

import { env } from "@/env.mjs";

export const twitter = new Client(env.TWITTER_BEARER_TOKEN);
export const twitterAuth = new auth.OAuth2Bearer(env.TWITTER_BEARER_TOKEN);
