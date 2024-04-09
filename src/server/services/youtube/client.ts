import { AuthPlus } from "@googleapis/youtube";

import { env } from "@/env.mjs";

const { OAuth2 } = new AuthPlus();

export const oauth2Client = new OAuth2(
	env.YOUTUBE_CLIENT_ID,
	env.YOUTUBE_CLIENT_SECRET,
	`${env.YOUTUBE_CALLBACK_URL}/api/webhooks/youtube/callback`,
);
