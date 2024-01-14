import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client } from "@/server/services/twitter/client";

export const twitterRouter = createTRPCRouter({
	generateOAuth2URL: protectedProcedure.query(() => {
		const { url, codeVerifier, state } = client.generateOAuth2AuthLink(
			`${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
			{ scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] },
		);

		// Redirect your user to {url}, store {state} and {codeVerifier} into a DB/Redis/memory after user redirection
		return { url, codeVerifier, state };
	}),
});
