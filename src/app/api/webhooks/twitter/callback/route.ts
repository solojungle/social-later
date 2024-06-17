/**
 * This is a working callback route for Twitter OAuth.
 * http://127.0.0.1:3000/api/webhooks/twitter/callback
 * https://feedfrenzy.co/api/webhooks/twitter/callback
 *
 * I've had trouble in the past with the callback route for Twitter OAuth.
 * so I'm leaving this here as a reference.
 */

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
	// Get the code and state from the URL query
	const url = req.nextUrl;
	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");
	const cookieStore = cookies();

	const codeVerifier = cookieStore.get("codeVerifier")?.value;
	const sessionState = cookieStore.get("state")?.value;
	const teamId = cookieStore.get("teamId")?.value;

	// You denied the app or your session expired
	if (!code || !state || !sessionState || !codeVerifier || !teamId) {
		redirect("/publish");
	}

	// Delete the cookies
	cookieStore.delete("codeVerifier");
	cookieStore.delete("state");
	cookieStore.delete("teamId");

	// Stored tokens didnt match
	if (state !== sessionState) {
		redirect("/publish");
	}

	try {
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

		// No refresh token
		if (!refreshToken) {
			redirect("/publish");
		}

		// Get the user object
		const { data: userObject } = await loggedClient.v2.me({
			"user.fields": ["profile_image_url"],
		});

		const profileImageUrl = userObject.profile_image_url || "";

		const expiresAt = new Date(Date.now() + expiresIn);

		await db.socialProfile.upsert({
			where: {
				username_teamId_type: {
					username: userObject.username,
					teamId,
					type: "twitter",
				},
			},
			create: {
				accessToken,
				refreshToken,
				expiresAt,
				type: "twitter",
				teamId,
				avatar: profileImageUrl,
				username: userObject.username,
			},
			update: {
				accessToken,
				refreshToken,
				expiresAt,
			},
		});
	} finally {
		// Successful
		redirect("/publish");
	}
}
