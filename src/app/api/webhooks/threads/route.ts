import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { db } from "@/server/db";
import { threads } from "@/server/services/threads/client";

export async function GET(req: NextRequest) {
	// Get the code and state from the URL query
	const url = req.nextUrl;
	const code = url.searchParams.get("code");
	const cookieStore = cookies();
	const teamId = cookieStore.get("teamId")?.value;

	// You denied the app or your session expired
	if (!code || !teamId) {
		redirect("/publish");
	}

	// Delete the cookies
	cookieStore.delete("teamId");

	try {
		const { access_token: shortLivedToken } =
			await threads.getAccessToken(code);
		const { access_token: accessToken, expires_in: expiresIn } =
			await threads.getLongLivedToken(shortLivedToken);

		// No tokens, threads does not give a refresh token
		if (!accessToken || !expiresIn) {
			redirect("/publish");
		}

		// Retrieve Threads profiles
		const profile = await threads.getUserProfile({
			userId: "me",
			fields: ["id", "username", "name", "threads_profile_picture_url"],
		});

		const timeInMs = expiresIn * 1000;

		return await db.socialProfile.upsert({
			where: {
				username_teamId_type: {
					username: profile.username,
					teamId,
					type: "threads",
				},
			},
			create: {
				accessToken,
				refreshToken: "", // Threads does not give a refresh token
				expiresAt: new Date(Date.now() + timeInMs),
				type: "threads",
				username: profile.username,
				name: profile.name,
				avatar: profile.threads_profile_picture_url,
				teamId,
			},
			update: {
				accessToken,
				expiresAt: new Date(Date.now() + timeInMs),
			},
		});
	} finally {
		redirect("/publish");
	}
}
