import { AuthPlus } from "@googleapis/youtube";

import { env } from "@/env.mjs";

const { OAuth2 } = new AuthPlus();

// To generate the authorization url
export const oauth2Client = new OAuth2(
	env.YOUTUBE_CLIENT_ID,
	env.YOUTUBE_CLIENT_SECRET,
	`${env.CALLBACK_URL}/api/webhooks/youtube/callback`,
);

type YTTokens = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
};

// This is to make the calls to the youtube api
export function getYTClientAuth({
	accessToken,
	refreshToken,
	expiresAt,
}: YTTokens) {
	oauth2Client.setCredentials({
		access_token: accessToken,
		refresh_token: refreshToken,
		expiry_date: expiresAt,
	});
	return oauth2Client;
}
