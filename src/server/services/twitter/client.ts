import { Client } from "twitter-api-sdk";

import { env } from "@/env.mjs";

export const twitter = new Client(env.TWITTER_BEARER_TOKEN);
