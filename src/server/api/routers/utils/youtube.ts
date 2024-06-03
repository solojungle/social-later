import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { google, youtubereporting_v1 } from "googleapis";

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
	const isUserPartOfTeam = await db.userOnTeam.findFirst({
		where: { teamId, userId },
	});
	if (!isUserPartOfTeam) throw new Error("You are not apart of this team");
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
		// eslint-disable-next-line no-await-in-loop
		const response = await youtubereporting.jobs.reports.list({
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
	profileId: string,
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

export const downloadReports = async (
	youtubereporting: youtubereporting_v1.Youtubereporting,
	newReports: any[],
) => {
	return Promise.all(
		newReports.map((report) =>
			youtubereporting.media.download(
				{ resourceName: "Bulk Report" },
				{ url: report.downloadUrl ?? "" },
			),
		),
	);
};

export const saveReports = async (
	db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
	downloads: any[],
	profileId: string,
) => {
	return Promise.all(
		downloads.map(async (download) => {
			const jsonResult = JSON.parse(download.data.toString());
			return db.youTubeVideoReport.create({
				data: {
					...jsonResult,
					profileId,
					report_id: jsonResult.report_id,
					create_time: jsonResult.create_time,
					start_time: jsonResult.start_time,
					end_time: jsonResult.end_time,
				},
			});
		}),
	);
};
