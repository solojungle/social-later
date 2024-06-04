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
	const isUserPartOfTeam = await db.userOnTeam.findUnique({
		where: { userId_teamId: { teamId, userId } },
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
