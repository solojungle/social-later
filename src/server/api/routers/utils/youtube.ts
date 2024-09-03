/* eslint-disable no-await-in-loop */
import { youtube_v3 } from "@googleapis/youtube";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { google, youtubeAnalytics_v2, youtubereporting_v1 } from "googleapis";
import { z } from "zod";

import { getYTClientAuth } from "@/server/services/youtube/client";

export const fetchYouTubeChannel = async (
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	profileId: string,
) => {
	const youtubeChannel = await db.socialProfile.findUnique({
		where: { id: profileId },
	});
	if (!youtubeChannel) throw new Error("YouTube channel does not exist");
	return youtubeChannel;
};

export const verifyUserTeamMembership = async (
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	userId: string,
	teamId: any,
) => {
	const isUserPartOfTeam = await db.userOnTeam.findUnique({
		where: { userId_teamId: { teamId, userId } },
	});
	if (!isUserPartOfTeam) throw new Error("You are not apart of this team");
};

export const initializeYouTubeDataClient = (youtubeChannel: {
	accessToken: any;
	refreshToken: any;
	expiresAt: { getTime: () => number };
}) => {
	const clientAuth = getYTClientAuth({
		accessToken: youtubeChannel.accessToken,
		refreshToken: youtubeChannel.refreshToken,
		expiresAt: youtubeChannel.expiresAt.getTime() - new Date().getTime(),
	});
	return google.youtube({ version: "v3", auth: clientAuth });
};

export const initializeYouTubeAnalyticsClient = (youtubeChannel: {
	accessToken: any;
	refreshToken: any;
	expiresAt: { getTime: () => number };
}) => {
	const clientAuth = getYTClientAuth({
		accessToken: youtubeChannel.accessToken,
		refreshToken: youtubeChannel.refreshToken,
		expiresAt: youtubeChannel.expiresAt.getTime() - new Date().getTime(),
	});
	return google.youtubeAnalytics({ version: "v2", auth: clientAuth });
};

export const initializeYouTubeReportingClient = (youtubeChannel: {
	accessToken: any;
	refreshToken: any;
	expiresAt: { getTime: () => number };
}) => {
	const clientAuth = getYTClientAuth({
		accessToken: youtubeChannel.accessToken,
		refreshToken: youtubeChannel.refreshToken,
		expiresAt: youtubeChannel.expiresAt.getTime() - new Date().getTime(),
	});
	return google.youtubereporting({ version: "v1", auth: clientAuth });
};

export const fetchLatestReportTimestamp = async (
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	profileId: string,
) => {
	const latestReport = await db.youTubeVideoReport.findFirst({
		where: { profileId },
		orderBy: { create_time: "desc" },
	});
	return latestReport?.create_time;
};

export const fetchAllReports = async (
	youtubereporting: youtubereporting_v1.Youtubereporting,
	jobId: any,
	initialLatestReportTimestamp: any,
) => {
	const reports = [];
	let nextPageToken;
	do {
		const response: any = await youtubereporting.jobs.reports.list({
			jobId,
			createdAfter: initialLatestReportTimestamp
				? new Date(initialLatestReportTimestamp).toISOString()
				: undefined,
			pageToken: nextPageToken,
		});
		if (!response.data.reports) return [];
		reports.push(...response.data.reports);
		nextPageToken = response.data.nextPageToken;
	} while (nextPageToken);
	return reports;
};

export const cleanReports = async (
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	reports: any[],
) => {
	const reportIds = reports.map((report) => report.id).filter((id) => id);
	const existingReports = await db.youTubeVideoReport.findMany({
		where: { report_id: { in: reportIds } },
	});
	return reports.filter(
		(report) =>
			!existingReports.some((existing) => existing.report_id === report.id),
	);
};

// Converts single single csv into an object
export const convertCSVToObject = (csv: string) => {
	const [headerLine, dataLine] = csv.trim().split("\n");

	if (!headerLine) {
		throw new Error("Invalid CSV format");
	}

	if (!dataLine) {
		return {};
	}

	const headers = headerLine.split(",");
	const data = dataLine.split(",");

	const resultObject: { [key: string]: any } = {};

	headers.forEach((header, index) => {
		resultObject[header] = data[index];
	});

	return resultObject;
};

// export const createReportingJob = async (
// 	youtubereporting: youtubereporting_v1.Youtubereporting,
// 	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
// 	profileId: string,
// ) => {
// 	const response = await youtubereporting.jobs.create({
// 		requestBody: {
// 			reportTypeId: "channel_basic_a2",
// 			name: "Bulk Report",
// 		},
// 	});

// 	// Update the social profile with the report id
// 	await db.socialProfile.update({
// 		where: {
// 			id: profileId,
// 		},
// 		data: {
// 			youtubeJobId: response.data.id,
// 		},
// 	});

// 	return response;
// };

export const downloadReports = async (
	youtubereporting: youtubereporting_v1.Youtubereporting,
	newReports: any[],
) => {
	const downloads = await Promise.all(
		newReports.map((report) =>
			youtubereporting.media.download(
				{ resourceName: "Bulk Report" },
				{ url: report.downloadUrl ?? "" },
			),
		),
	);

	// Convert the download data to an object
	downloads.forEach((download) => {
		// eslint-disable-next-line no-param-reassign
		download.data = convertCSVToObject(download.data.toString());
	});

	// Now add the reports id, startTime, endTime, createTime to the download object
	return downloads.map((download, index) => {
		const report = newReports[index];
		return {
			data: download.data,
			report_id: report.id,
			start_time: report.startTime,
			end_time: report.endTime,
			create_time: report.createTime,
		};
	});
};

export const saveReports = async (
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	downloads: any[],
	profileId: string,
) => {
	const result = await db.youTubeVideoReport.createMany({
		data: downloads.map((download) => ({
			...download.data,
			profileId,
			report_id: download.report_id,
			create_time: download.create_time,
			start_time: download.start_time,
			end_time: download.end_time,
		})),
	});

	return result;
};

export async function fetchRealTimeVideoData({
	youtubeDataClient,
	videoId,
}: {
	youtubeDataClient: youtube_v3.Youtube;
	videoId: string;
}) {
	const response = await youtubeDataClient.videos.list({
		part: ["statistics"],
		id: [videoId],
	});

	return response;
}

export const fetchHistoricalData = async (
	youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics,
) => {
	// Fetch historical data
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const endDate = today.toISOString().split("T")[0];
	const startDate = new Date(
		new Date().setFullYear(new Date().getFullYear() - 1),
	)
		.toISOString()
		.split("T")[0];

	const historicalRequest = {
		dimensions: "day",
		startDate,
		endDate,
		ids: "channel==MINE",
		metrics:
			"views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained",
		sort: "day",
	};

	const historicalResponse =
		await youtubeAnalytics.reports.query(historicalRequest);

	const historicalData =
		historicalResponse.data?.rows?.map((row) => ({
			date: row[0],
			views: Number(row[1]),
			watch_time_minutes: Number(row[2]),
			average_view_duration: Number(row[3]),
			average_view_percentage: Number(row[4]),
			subscribers_gained: Number(row[5]),
		})) || [];

	return historicalData;
};

export function fetchHistoricViewsAndSubscribers({
	youtubeAnalytics,
	startDate,
	endDate,
	videoId,
}: {
	youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics;
	startDate: string;
	endDate: string;
	videoId: string[];
}) {
	const historicalRequest = {
		dimensions: "day",
		startDate,
		endDate,
		ids: "channel==MINE",
		metrics: "views,subscribersGained",
		sort: "day",
		filters: `video==${videoId.join(",")}`,
	};

	return youtubeAnalytics.reports.query(historicalRequest);
}

const VideoMetrics = z.object({
	id: z.string(),
	title: z.string(),
	thumbnail: z.string(),
	publishedAt: z.string(),
	views: z.number(),
	likes: z.number(),
	comments: z.number(),
	subscribersGained: z.number(),
	isShort: z.boolean(),
});

export async function fetchVideoMetrics(
	youtubeDataClient: youtube_v3.Youtube,
	youtubeAnalytics: youtubeAnalytics_v2.Youtubeanalytics,
	videoIds: string[],
) {
	// Fetch video details
	const videoDetailsResponse = await youtubeDataClient.videos.list({
		part: ["snippet", "statistics", "contentDetails"],
		id: videoIds,
	});

	// Prepare date range for analytics
	const oldestVideo = videoDetailsResponse.data.items?.reduce(
		(oldest, current) => {
			const currentDate = new Date(current.snippet?.publishedAt || "");
			return currentDate < oldest ? currentDate : oldest;
		},
		new Date(),
	);

	if (!oldestVideo) {
		return [];
	}

	// Fetch analytics data for all videos in one call
	const analyticsResponse = await youtubeAnalytics.reports.query({
		ids: "channel==MINE",
		startDate: "2019-01-01",
		endDate: new Date().toISOString().split("T")[0],
		metrics: "views,subscribersGained",
		dimensions: "video,creatorContentType",
		filters: `video==${videoIds.join(",")}`,
	});

	// Process and combine the data
	return (
		videoDetailsResponse.data.items?.map((video) => {
			const analyticsData = analyticsResponse.data.rows?.find(
				(row) => row[0] === video.id,
			);
			const isShort = analyticsData?.[1] === "shorts";

			return VideoMetrics.parse({
				id: video.id || "",
				title: video.snippet?.title || "",
				thumbnail: video.snippet?.thumbnails?.default?.url || "",
				publishedAt: video.snippet?.publishedAt || "",
				views: Number(video.statistics?.viewCount) || 0,
				likes: Number(video.statistics?.likeCount) || 0,
				comments: Number(video.statistics?.commentCount) || 0,
				subscribersGained: Number(analyticsData?.[1]) || 0,
				isShort,
			});
		}) || []
	);
}
