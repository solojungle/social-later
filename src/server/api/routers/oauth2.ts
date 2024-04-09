import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/services/twitter/client";
import { oauth2Client } from "@/server/services/youtube/client";

export const oauth2Router = createTRPCRouter({
	generateYoutubeOAuth2URL: protectedProcedure.query(() => {
		// Generate a url that asks permissions for YouTube scope
		const scopes = ["https://www.googleapis.com/auth/youtube"];

		// TODO: add code and codeVerifier to the response
		const codeVerifier = "";
		const state = "";

		const url = oauth2Client.generateAuthUrl({
			access_type: "offline",
			scope: scopes,
		});

		// Redirect your user to {url}, store {state} and {codeVerifier} into a DB/Redis/memory after user redirection
		return { url, codeVerifier, state };
	}),

	generateTwitterOAuth2URL: protectedProcedure.query(() => {
		const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
			`${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
			{ scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] },
		);

		// Redirect your user to {url}, store {state} and {codeVerifier} into a DB/Redis/memory after user redirection
		return { url, codeVerifier, state };
	}),
});
