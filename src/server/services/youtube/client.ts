import { env } from "@/env.mjs";
import { AuthPlus } from "@googleapis/youtube";

const { OAuth2 } = new AuthPlus();

// To generate the authorization url
export const oauth2Client = new OAuth2(
  env.YOUTUBE_CLIENT_ID,
  env.YOUTUBE_CLIENT_SECRET,
  `${env.CALLBACK_URL}/api/webhooks/youtube/callback`,
);

type YTTokens = {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
};

// This is to make the calls to the youtube api
export function getYTClientAuth({
  accessToken,
  expiresAt,
  refreshToken,
}: YTTokens) {
  oauth2Client.setCredentials({
    access_token: accessToken,
    expiry_date: expiresAt,
    refresh_token: refreshToken,
  });
  return oauth2Client;
}
