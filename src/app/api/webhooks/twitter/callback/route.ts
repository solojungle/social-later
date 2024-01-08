/* eslint-disable indent */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { client } from "@/server/services/twitter/client";

/**
 * This is the callback route for Twitter OAuth.
 */
export async function GET(req: NextRequest) {
	try {
		// Get the code and state from the URL query
		const url = new URL(req.url);
		const code = url.searchParams.get("code");
		const state = url.searchParams.get("state");
		const cookieStore = cookies();

		const codeVerifier = cookieStore.get("codeVerifier")?.value;
		const sessionState = cookieStore.get("state")?.value;
		const teamId = cookieStore.get("teamId")?.value;

		if (!code || !state || !sessionState || !codeVerifier || !teamId) {
			throw new Error("You denied the app or your session expired");
		}

		// Delete the cookies
		cookieStore.delete("codeVerifier");
		cookieStore.delete("state");
		cookieStore.delete("teamId");

		if (state !== sessionState) {
			return new Error("Stored tokens didnt match");
		}

		const { accessToken, refreshToken, expiresIn } =
			await client.loginWithOAuth2({
				code,
				codeVerifier,
				redirectUri: `${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
			});

		if (!refreshToken) {
			throw new Error("No refresh token");
		}

		await db.twitterAccount.create({
			data: {
				accessToken,
				refreshToken,
				expiresIn,
				teamId,
			},
		});
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		redirect("/publish");
	}
}
