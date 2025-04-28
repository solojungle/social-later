import { env } from "@/env.mjs";
import { TwitterApi } from "twitter-api-v2";

// TODO: Change to oauth2Client
export const client = new TwitterApi({
  clientId: env.TWITTER_CLIENT_ID,
  clientSecret: env.TWITTER_CLIENT_SECRET,
});

// TODO: Change to oauth1Client
export const v1client = new TwitterApi({
  accessSecret: env.TWITTER_ACCESS_SECRET,
  accessToken: env.TWITTER_ACCESS_TOKEN,
  appKey: env.TWITTER_APP_KEY,
  appSecret: env.TWITTER_APP_SECRET,
});
