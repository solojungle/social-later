import { TwitterApi } from "twitter-api-v2";

import { env } from "@/env.mjs";

export const client = new TwitterApi({
	clientId: env.TWITTER_CLIENT_ID,
	clientSecret: env.TWITTER_CLIENT_SECRET,
});

export const v1client = new TwitterApi({
	appKey: "X61xwtbC65UKIAuxqyvTw4jql",
	appSecret: "gx8TT4dJe4Cy05bd5E2GnPgVzdWuPRKIyDo1DIndMRqW4hxDhp",
	accessToken: "1261465989528596491-3SonpxdePtyt692wFxKyktiQN5w3aJ",
	accessSecret: "EHNslYEoSCK35tcrH1coSgQiK56VRWoZcSX33S71boJHn",
});
