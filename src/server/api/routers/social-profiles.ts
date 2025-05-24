import { youtube } from "@googleapis/youtube";
import { SocialType } from "@prisma/client";
import { Readable } from "stream";
import { TwitterApi } from "twitter-api-v2";
import { z } from "zod";

import { TweetSchema } from "@/schemas/posts-schema";
import { TeamSchema } from "@/schemas/team-schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { client, v1client } from "@/server/services/twitter/client";
import { getYTClientAuth } from "@/server/services/youtube/client";

import { getS3Url } from "./utils/aws";
import {
  cleanReports,
  downloadReports,
  fetchAllReports,
  fetchLatestReportTimestamp,
  fetchYouTubeChannel,
  initializeYouTubeAnalyticsClient,
  initializeYouTubeDataClient,
  initializeYouTubeReportingClient,
  saveReports,
  verifyUserTeamMembership,
} from "./utils/youtube";

// This function will refresh the account if the token is expired
// will then return the client
async function getTwitterClientOrRefresh({
  accessToken,
  ctx,
  expiresAt,
  refreshToken,
  socialAccountId,
  updatedAt,
}: {
  accessToken: string;
  ctx: any;
  expiresAt: Date;
  refreshToken: string;
  socialAccountId: string;
  updatedAt: Date;
}) {
  if (expiresAt <= new Date()) {
    // TODO: this is giving me issues constantly
    const {
      accessToken: refreshedAccessToken,
      client: refreshedClient,
      expiresIn: refreshedExpiresIn,
      refreshToken: refreshedRefreshToken,
    } = await client.refreshOAuth2Token(refreshToken);

    await ctx.db.socialProfile.update({
      data: {
        accessToken: refreshedAccessToken,
        expiresAt: new Date(updatedAt.getTime() + refreshedExpiresIn),
        refreshToken: refreshedRefreshToken,
      },
      where: {
        id: socialAccountId,
      },
    });

    return refreshedClient;
  }

  return new TwitterApi(accessToken);
}

async function getVideoFileBuffer({ url }: { url: string }) {
  // Get all the files from AWS
  const buffer = await fetch(url);

  return Readable.from(Buffer.from(await buffer.arrayBuffer()));
}

async function uploadMediaToTwitter({
  ctx,
  input,
}: {
  ctx: any;
  input: { mediaIds: string[] };
}) {
  // Get the files from the database
  const files = await ctx.db.file.findMany({
    where: {
      id: {
        in: input.mediaIds,
      },
    },
  });

  if (!files) {
    throw new Error("Files do not exist");
  }

  // Get all the files from AWS
  const buffers = await Promise.all(
    files.map(async (file: any) => {
      const response = await fetch(`${getS3Url(file.key)}.${file.extension}`);
      return Buffer.from(await response.arrayBuffer());
    }),
  );

  // Upload media to twitter via url
  const mediaIds = await Promise.all(
    buffers.map(async (buffer, index) => {
      const mediaId = await v1client.v1.uploadMedia(buffer, {
        mimeType: files[index]?.mime, // Add null check
      });
      return mediaId;
    }),
  );

  return mediaIds;
}

export const socialProfilesRouter = createTRPCRouter({
  changeVideoThumbnail: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        thumbnailUrl: z.string(),
        videoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { profileId: ytAccountId, thumbnailUrl, videoId } = input;

      const ytAccount = await fetchYouTubeChannel(ctx.db, ytAccountId);

      await verifyUserTeamMembership(
        ctx.db,
        ctx.session.user.id,
        ytAccount.teamId,
      );

      const yt = initializeYouTubeDataClient(ytAccount);

      const response = await yt.thumbnails.set({
        media: {
          body: await getVideoFileBuffer({ url: thumbnailUrl }),
        },
        videoId,
      });

      return response;
    }),

  deleteTweet: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
        internalPostId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { accountId, internalPostId } = input;

      // Check if the post exists
      const post = await ctx.db.post.findUnique({
        where: {
          id: internalPostId,
        },
      });

      if (!post) {
        throw new Error("Post does not exist");
      }

      // Make sure the user is apart of the team, and that the twitter account belongs to the team
      const twitterAccount = await ctx.db.socialProfile.findUnique({
        where: {
          id: accountId,
        },
      });

      if (!twitterAccount) {
        throw new Error("Twitter account does not exist");
      }

      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId: twitterAccount.teamId,
          userId: ctx.session.user.id,
        },
      });

      if (!isUserPartOfTeam) {
        throw new Error("You are not apart of this team");
      }

      const loggedClient = await getTwitterClientOrRefresh({
        accessToken: twitterAccount.accessToken,
        ctx,
        expiresAt: twitterAccount.expiresAt,
        refreshToken: twitterAccount.refreshToken,
        socialAccountId: twitterAccount.id,
        updatedAt: twitterAccount.updatedAt,
      });

      const tweet = await loggedClient.v2.deleteTweet(post.externalPostId);

      return tweet;
    }),

  getBulkYouTubeReport: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { profileId } = input;
      const { db, session } = ctx;

      // Get the youtube channel, and verify the user is apart of the team
      const youtubeChannel = await fetchYouTubeChannel(db, profileId);
      await verifyUserTeamMembership(
        db,
        session.user.id,
        youtubeChannel.teamId,
      );

      // This is the first time the user is trying to get the report
      // Instead of creating a side effect, we will return null
      if (!youtubeChannel.youtubeJobId) return null;

      // Initialize the youtube reporting client
      const youtubereporting = initializeYouTubeReportingClient(youtubeChannel);

      // Fetch all the reports and the latest report timestamp
      const initialLatestReportTimestamp = await fetchLatestReportTimestamp(
        db,
        profileId,
      );

      // List all the reports, that have been created after the latest report
      const reports = await fetchAllReports(
        youtubereporting,
        youtubeChannel.youtubeJobId,
        initialLatestReportTimestamp,
      );

      if (reports.length === 0) return null;

      // Remove any reports that have already been saved, and null reports
      const newReports = await cleanReports(db, reports);
      if (newReports.length === 0) return null;

      const downloads = await downloadReports(youtubereporting, newReports);

      const savedReports = await saveReports(db, downloads, profileId);

      return savedReports;
    }),

  getLast10YouTubeVideos: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { profileId } = input;
      const { db, session } = ctx;

      // Get the youtube channel, and verify the user is apart of the team
      const youtubeChannel = await fetchYouTubeChannel(db, profileId);
      await verifyUserTeamMembership(
        db,
        session.user.id,
        youtubeChannel.teamId,
      );

      // Initialize the youtube reporting client
      const youtubedata = initializeYouTubeDataClient(youtubeChannel);

      // Your channel ID, remove first two characters, and add "UU" to the beginning
      const uploadPlaylistId = `UU${youtubeChannel.username.slice(2)}`;

      const videos = await youtubedata.playlistItems.list({
        part: ["snippet"],
        playlistId: uploadPlaylistId,
      });

      // Return an array of the last 10 videos
      const last10Videos = videos.data.items?.slice(0, 10);

      if (!last10Videos) {
        return [];
      }

      return last10Videos.map((video) => ({
        thumbnail: video?.snippet?.thumbnails?.default?.url,
        title: video?.snippet?.title,
        url: `https://www.youtube.com/watch?v=${video?.snippet?.resourceId?.videoId}`,
      }));
    }),

  getRealtimeYouTubeAnalytics: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { profileId: ytAccountId } = input;

      // Make sure the user is apart of the team, and that the account belongs to the team
      const ytAccount = await ctx.db.socialProfile.findUnique({
        where: {
          id: ytAccountId,
        },
      });

      if (!ytAccount) {
        throw new Error("YouTube account does not exist");
      }

      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId: ytAccount.teamId,
          userId: ctx.session.user.id,
        },
      });

      if (!isUserPartOfTeam) {
        throw new Error("You are not apart of this team");
      }

      const clientAuth = getYTClientAuth({
        accessToken: ytAccount.accessToken,
        expiresAt:
          ytAccount.expiresAt.getTime() - new Date(Date.now()).getTime(),
        refreshToken: ytAccount.refreshToken,
      });

      const yt = youtube({
        auth: clientAuth,
        version: "v3",
      });

      const response = await yt.channels.list({
        mine: true,
        part: ["statistics"],
      });

      return response;
    }),

  // createBulkYouTubeReport: protectedProcedure
  // 	.input(
  // 		z.object({
  // 			profileId: z.string(),
  // 		}),
  // 	)
  // 	.mutation(async ({ ctx, input }) => {
  // 		const { profileId } = input;
  // 		const { db, session } = ctx;

  // 		// Fetch the YouTube channel details
  // 		const youtubeChannel = await fetchYouTubeChannel(db, profileId);
  // 		await verifyUserTeamMembership(
  // 			db,
  // 			session.user.id,
  // 			youtubeChannel.teamId,
  // 		);

  // 		// Check if we already have a job running
  // 		if (youtubeChannel.youtubeJobId) {
  // 			throw new Error("A bulk report job is already running");
  // 		}

  // 		// Initialize the youtube reporting client
  // 		const youtubereporting = initializeYouTubeReportingClient(youtubeChannel);

  // 		const response = createReportingJob(youtubereporting, db, profileId);

  // 		return response;
  // 	}),

  getShortsVsLongsViews: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { profileId } = input;
      const { db, session } = ctx;

      // Get the youtube channel, and verify the user is apart of the team
      const youtubeChannel = await fetchYouTubeChannel(db, profileId);
      await verifyUserTeamMembership(
        db,
        session.user.id,
        youtubeChannel.teamId,
      );

      // Initialize the youtube reporting client
      const youtubereporting = initializeYouTubeAnalyticsClient(youtubeChannel);

      const youtubedata = initializeYouTubeDataClient(youtubeChannel);

      // Your channel ID, remove first two characters, and add "UU" to the beginning
      const uploadPlaylistId = `UU${youtubeChannel.username.slice(2)}`;

      const videos = await youtubedata.playlistItems.list({
        part: ["snippet"],
        playlistId: uploadPlaylistId,
      });

      const videoIds = videos.data.items?.map(
        (video) => video?.snippet?.resourceId?.videoId,
      );

      if (!videoIds) {
        throw new Error("No videos found");
      }

      const { data } = await youtubereporting.reports.query({
        dimensions: "video,creatorContentType",
        endDate: new Date().toISOString().split("T")[0],
        filters: `video==${videoIds.join(",")}`,
        ids: "channel==MINE",
        metrics: "views",
        startDate: "2019-01-01",
      });

      // We're assuming that the columnHeaders are always in the same order
      const { rows } = data;

      const videoViews = {
        liveStreams: 0,
        long: 0,
        other: 0,
        shorts: 0,
        stories: 0,
      };

      if (!rows) {
        return videoViews;
      }

      rows.forEach((row) => {
        const viewType = row[1].toLowerCase();
        const views = row[2];

        switch (viewType) {
          case "livestream":
            videoViews.liveStreams += views;
            break;
          case "shorts":
            videoViews.shorts += views;
            break;
          case "story":
            videoViews.stories += views;
            break;
          case "videoondemand":
            videoViews.long += views;
            break;
          default:
            videoViews.other += views;
            break;
        }
      });

      return videoViews;
    }),

  getSocialProfiles: protectedProcedure
    .input(
      TeamSchema.pick({ id: true }).extend({
        type: z.nativeEnum(SocialType).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id: teamId } = input;

      // 1. Grab the information of the user submitting the form
      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId,
          userId: ctx.session.user.id,
        },
      });

      if (!isUserPartOfTeam) {
        throw new Error("You are not apart of this team");
      }

      // 2. Grab all the twitter accounts for the team
      const profiles = await ctx.db.socialProfile.findMany({
        where: {
          teamId,
        },
      });

      return (
        profiles.map((profile) => ({
          avatar: profile.avatar,
          id: profile.id,
          name: profile.name,
          teamId: profile.teamId,
          type: profile.type,
          username: profile.username,
        })) || []
      );
    }),

  postTweet: protectedProcedure
    .input(TweetSchema)
    .mutation(async ({ ctx, input }) => {
      const { profileId: twitterAccountId } = input;

      // Make sure the user is apart of the team, and that the twitter account belongs to the team
      const twitterAccount = await ctx.db.socialProfile.findUnique({
        where: {
          id: twitterAccountId,
        },
      });

      if (!twitterAccount) {
        throw new Error("Twitter account does not exist");
      }

      const isUserPartOfTeam = await ctx.db.userOnTeam.findFirst({
        where: {
          teamId: twitterAccount.teamId,
          userId: ctx.session.user.id,
        },
      });

      if (!isUserPartOfTeam) {
        throw new Error("You are not apart of this team");
      }

      const loggedClient = await getTwitterClientOrRefresh({
        accessToken: twitterAccount.accessToken,
        ctx,
        expiresAt: twitterAccount.expiresAt,
        refreshToken: twitterAccount.refreshToken,
        socialAccountId: twitterAccount.id,
        updatedAt: twitterAccount.updatedAt,
      });

      const hasMedia = "mediaIds" in input;
      const hasContent = "content" in input;

      if (hasContent && hasMedia) {
        // Upload media to twitter via url
        const mediaIds = await uploadMediaToTwitter({
          ctx,
          input,
        });

        // Use media_ids to tweet
        const tweet = await loggedClient.v2.tweet(input.content, {
          media: {
            media_ids: mediaIds,
          },
        });

        return tweet;
      }
      if (hasMedia) {
        // Upload media to twitter via url
        const mediaIds = await uploadMediaToTwitter({
          ctx,
          input,
        });

        // Use media_ids to tweet
        const tweet = await loggedClient.v2.tweet({
          media: {
            media_ids: mediaIds,
          },
        });

        return tweet;
      }
      if (hasContent) {
        const tweet = await loggedClient.v2.tweet(input.content);

        return tweet;
      }

      throw new Error("You must provide content or media to tweet");
    }),

  uploadYouTubeVideo: protectedProcedure
    .input(
      z.object({
        description: z.string().optional(),
        profileId: z.string(),
        scheduledTime: z.string().optional(),
        title: z.string(),
        videoUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { profileId: ytAccountId } = input;

      const ytAccount = await fetchYouTubeChannel(ctx.db, ytAccountId);

      await verifyUserTeamMembership(
        ctx.db,
        ctx.session.user.id,
        ytAccount.teamId,
      );

      const yt = initializeYouTubeDataClient(ytAccount);

      let requestBody: any = {
        snippet: {
          description: input.description,
          title: input.title,
        },
      };

      // If scheduledTime is provided, set the publishAt field
      if (input.scheduledTime) {
        const scheduledTime = new Date(input.scheduledTime);

        // Check if the scheduledTime is at least 60 minutes into the future
        if (scheduledTime.getTime() - Date.now() >= 60 * 60 * 1000) {
          requestBody = {
            ...requestBody,
            status: {
              privacyStatus: "private",
              publishAt: scheduledTime.toISOString(),
            },
          };
        }
      }

      const response = await yt.videos.insert({
        media: {
          body: await getVideoFileBuffer({ url: input.videoUrl }),
        },
        part: ["snippet", "status"],
        requestBody,
      });

      // If no scheduledTime is provided, make the video public immediately
      if (!input.scheduledTime) {
        await yt.videos.update({
          part: ["status"],
          requestBody: {
            id: response.data.id,
            status: {
              privacyStatus: "public",
            },
          },
        });
      }

      return response;
    }),
});
