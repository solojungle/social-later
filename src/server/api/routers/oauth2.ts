import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { oauth2Client as li } from "@/server/services/linkedin/client";
import { client } from "@/server/services/twitter/client";
import { oauth2Client as yt } from "@/server/services/youtube/client";

export const oauth2Router = createTRPCRouter({
	generateYoutubeOAuth2URL: protectedProcedure.query(() => {
		// Generate a url that asks permissions for YouTube scope
		const scopes = [
			"https://www.googleapis.com/auth/youtube",
			"https://www.googleapis.com/auth/youtube.readonly",
			"https://www.googleapis.com/auth/youtubepartner",
			"https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
			"https://www.googleapis.com/auth/yt-analytics.readonly",
		];

		// TODO: add code and codeVerifier to the response
		const codeVerifier = "";
		const state = "";

		const url = yt.generateAuthUrl({
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

	generateLinkedinOAuth2URL: protectedProcedure.query(() => {
		// TODO: add code and codeVerifier to the response
		const codeVerifier = "";
		const state = "";

		const url = li.generateMemberAuthorizationUrl([
			"w_member_social",
			"openid",
			"profile",
		]);

		return { url, codeVerifier, state };
	}),
});
