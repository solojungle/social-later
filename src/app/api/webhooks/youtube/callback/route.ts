import { youtube } from "@googleapis/youtube";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { initializeYouTubeReportingClient } from "@/server/api/routers/utils/youtube";
import { db } from "@/server/db";
import { oauth2Client } from "@/server/services/youtube/client";

/**
 * This is the callback route for YouTube OAuth.
 */
export async function GET(req: NextRequest) {
	// Get the code and state from the URL query
	const url = req.nextUrl;
	const code = url.searchParams.get("code");
	// TODO: Currently not using a code_verifier, but it should be used
	const cookieStore = cookies();
	const teamId = cookieStore.get("teamId")?.value;

	// You denied the app or your session expired
	if (!code || !teamId) {
		redirect("/publish");
	}

	// Delete the cookies
	cookieStore.delete("teamId");

	try {
		const { tokens } = await oauth2Client.getToken(code);
		const {
			access_token: accessToken,
			refresh_token: refreshToken,
			expiry_date: expiresIn,
		} = tokens;

		// No tokens
		if (!refreshToken || !accessToken || !expiresIn) {
			redirect("/publish");
		}

		// Get the user object from ChannelProfileDetails
		const client = youtube("v3");

		// Set the credentials
		oauth2Client.setCredentials(tokens);

		const { data } = await client.channels.list({
			auth: oauth2Client,
			part: ["snippet"],
			mine: true,
		});

		const channels = data.items || [];

		const youtubeReporting = initializeYouTubeReportingClient({
			accessToken,
			refreshToken,
			expiresAt: new Date(Date.now() + expiresIn),
		});

		// Check to see if the user has any jobs
		const jobs = await youtubeReporting.jobs.list();
		let job = jobs.data?.jobs?.find((j) => j.name === "Bulk Report");

		// if there is no job we create one
		// this job is used across all channels
		if (!job) {
			const response = await youtubeReporting.jobs.create({
				requestBody: {
					reportTypeId: "channel_basic_a2",
					name: "Bulk Report",
				},
			});

			job = response.data;
		}

		await Promise.all(
			channels.map(async (channel) => {
				const { snippet } = channel;

				if (!snippet) {
					return undefined;
				}

				const { customUrl, thumbnails } = snippet;

				const { url: thumbnailURL } = thumbnails?.default || {};

				return db.socialProfile.upsert({
					where: {
						username_teamId: {
							username: customUrl || "",
							teamId,
						},
					},
					create: {
						accessToken,
						refreshToken,
						expiresAt: new Date(Date.now() + expiresIn),
						type: "youtube",
						teamId,
						avatar: thumbnailURL || "",
						username: customUrl || "",
						youtubeJobId: job?.id,
					},
					update: {
						accessToken,
						refreshToken,
						expiresAt: new Date(Date.now() + expiresIn),
					},
				});
			}),
		);
	} finally {
		// Successful
		redirect("/publish");
	}
}
