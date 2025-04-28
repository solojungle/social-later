import { env } from "@/env.mjs";
import { AuthClient } from "linkedin-api-client";

export const oauth2Client = new AuthClient({
  clientId: env.LINKEDIN_CLIENT_ID,
  clientSecret: env.LINKEDIN_CLIENT_SECRET,
  redirectUrl: `${env.CALLBACK_URL}/api/webhooks/linkedin/callback`,
});
