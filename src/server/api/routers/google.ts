import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { oauth2Client } from "@/server/services/youtube/client";

export const googleRouter = createTRPCRouter({
	generateOAuth2URL: protectedProcedure.query(() => {
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
});
