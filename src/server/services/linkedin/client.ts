import { AuthClient } from "linkedin-api-client";

import { env } from "@/env.mjs";

export const oauth2Client = new AuthClient({
	clientId: env.LINKEDIN_CLIENT_ID,
	clientSecret: env.LINKEDIN_CLIENT_SECRET,
	redirectUrl: `${env.LINKEDIN_CALLBACK_URL}/api/webhooks/linkedin/callback`,
});
