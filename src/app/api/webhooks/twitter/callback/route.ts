/**
 * This is a working callback route for Twitter OAuth.
 * http://127.0.0.1:3000/api/webhooks/twitter/callback
 * https://feedfrenzy.co/api/webhooks/twitter/callback
 *
 * I've had trouble in the past with the callback route for Twitter OAuth.
 * so I'm leaving this here as a reference.
 */

import { env } from "@/env.mjs";
import { db } from "@/server/db";
import { client } from "@/server/services/twitter/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * This is the callback route for Twitter OAuth.
 */
export async function GET(req: NextRequest) {
  // Get the code and state from the URL query
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();

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
      accessToken,
      client: loggedClient,
      expiresIn,
      refreshToken,
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
      create: {
        accessToken,
        avatar: profileImageUrl,
        expiresAt,
        refreshToken,
        teamId,
        type: "twitter",
        username: userObject.username,
      },
      update: {
        accessToken,
        expiresAt,
        refreshToken,
      },
      where: {
        username_teamId_type: {
          teamId,
          type: "twitter",
          username: userObject.username,
        },
      },
    });
  } finally {
    // Successful
    redirect("/publish");
  }
}
