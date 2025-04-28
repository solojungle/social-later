import { db } from "@/server/db";
import { oauth2Client } from "@/server/services/linkedin/client";
import { RestliClient } from "linkedin-api-client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

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

  /**
   * LinkedIn is stingy with their refresh tokens, so we can only store the access token.
   * and then ask the user to re-authenticate when the token expires.
   */

  try {
    const tokenDetails =
      await oauth2Client.exchangeAuthCodeForAccessToken(code);

    const { access_token: accessToken, expires_in: expiresIn } = tokenDetails;

    // No tokens
    if (!accessToken || !expiresIn) {
      redirect("/publish");
    }

    // Fetch the user's profile
    const restliClient = new RestliClient();

    const { data } = await restliClient.get({
      accessToken,
      resourcePath: "/userinfo",
    });

    await db.socialProfile.upsert({
      create: {
        accessToken,
        avatar: data.picture,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        name: data.name,
        refreshToken: "",
        teamId,
        type: "linkedin",
        username: data.sub,
      },
      update: {
        accessToken,
        expiresAt: new Date(Date.now() + expiresIn * 1000),
        refreshToken: "",
      },
      where: {
        username_teamId_type: {
          teamId,
          type: "linkedin",
          username: data.sub,
        },
      },
    });
  } finally {
    // Successful
    redirect("/publish");
  }
}
