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
			return new Response("You denied the app or your session expired", {
				status: 403,
			});
		}

		// Delete the cookies
		cookieStore.delete("codeVerifier");
		cookieStore.delete("state");
		cookieStore.delete("teamId");

		if (state !== sessionState) {
			return new Response("Stored tokens didnt match", {
				status: 403,
			});
		}

		const {
			client: loggedClient,
			accessToken,
			refreshToken,
			expiresIn,
		} = await client.loginWithOAuth2({
			code,
			codeVerifier,
			redirectUri: `${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
		});

		if (!refreshToken) {
			return new Response("No refresh token", {
				status: 500,
			});
		}

		// Get the user object
		const { data: userObject } = await loggedClient.v2.me();

		await db.twitterAccount.upsert({
			where: {
				username_teamId: {
					username: userObject.username,
					teamId,
				},
			},
			create: {
				accessToken,
				refreshToken,
				expiresIn,
				teamId,
				username: userObject.username,
			},
			update: {
				accessToken,
				refreshToken,
				expiresIn,
			},
		});
	} catch (error) {
		console.error(error);
	} finally {
		redirect("/publish");
	}
}
