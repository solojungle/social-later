import { env } from "@/env.mjs";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { oauth2Client as li } from "@/server/services/linkedin/client";
import { threads } from "@/server/services/threads/client";
import { client } from "@/server/services/twitter/client";
import { oauth2Client as yt } from "@/server/services/youtube/client";

export const oauth2Router = createTRPCRouter({
  generateLinkedinOAuth2URL: protectedProcedure.query(() => {
    // TODO: add code and codeVerifier to the response
    const codeVerifier = "";
    const state = "";

    const url = li.generateMemberAuthorizationUrl([
      "w_member_social",
      "openid",
      "profile",
    ]);

    return { codeVerifier, state, url };
  }),

  generateThreadsOAuth2URL: protectedProcedure.query(() => {
    const codeVerifier = "";
    const state = "";
    const url = threads.getAuthorizationUrl();

    return { codeVerifier, state, url };
  }),

  generateTwitterOAuth2URL: protectedProcedure.query(() => {
    const { codeVerifier, state, url } = client.generateOAuth2AuthLink(
      `${env.TWITTER_CALLBACK_URL}/api/webhooks/twitter/callback`,
      { scope: ["tweet.read", "tweet.write", "users.read", "offline.access"] },
    );

    // Redirect your user to {url}, store {state} and {codeVerifier} into a DB/Redis/memory after user redirection
    return { codeVerifier, state, url };
  }),

  generateYoutubeOAuth2URL: protectedProcedure.query(() => {
    // Generate a url that asks permissions for YouTube scope
    const scopes = [
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/youtube.readonly",
      "https://www.googleapis.com/auth/youtubepartner",
      "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
      "https://www.googleapis.com/auth/yt-analytics.readonly",
    ];

    // TODO: add code and codeVerifier to the response
    const codeVerifier = "";
    const state = "";

    const url = yt.generateAuthUrl({
      access_type: "offline",
      // https://github.com/googleapis/google-api-python-client/issues/213
      // The oauth2 server will only ever mint one refresh token at a time
      // if you request another access token via the flow it will operate
      // as if you only asked for an access token.
      prompt: "consent",
      scope: scopes,
    });

    // Redirect your user to {url}, store {state} and {codeVerifier} into a DB/Redis/memory after user redirection
    return { codeVerifier, state, url };
  }),
});
