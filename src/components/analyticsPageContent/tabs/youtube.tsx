"use client";

import { Loader2 } from "lucide-react";

import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { AudienceGrowth } from "../audienceGrowth";
import { MostRecentVideo } from "../mostRecentVideo";
import { ViewsComparisons } from "../viewsComparisons";
import { YouTubePerformanceSummary } from "../youTubePerformanceSummary";

export const YouTubeAnalyticsTab = () => {
	const { currentProfileId } = useSocialProfilesStore();

	const { data, isFetching, isError } =
		api.analytics.combinedYouTubeAnalytics.useQuery(
			{
				profileId: currentProfileId,
			},
			{
				enabled: !!currentProfileId,
				staleTime: 1000 * 60 * 60 * 24, // 24 hours
			},
		);

	if (isFetching || isError || !data) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const counts = data?.realtimeAnalytics;

	// Format the data for the performance summary
	const performanceData = {
		views: {
			value: String(counts?.viewCount),
			increase: {
				daily: "0",
				weekly: "0",
				monthly: "0",
				annually: "0",
			},
		},
		subscribers: {
			value: String(counts?.subscriberCount),
			increase: {
				daily: "0",
				weekly: "0",
				monthly: "0",
				annually: "0",
			},
		},
	};

	return (
		<div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-2">
			<div className="col-span-2 space-y-2">
				<YouTubePerformanceSummary values={performanceData} />
				<AudienceGrowth metrics={data?.historicalData} />
			</div>
			<div className="col-span-1 space-y-2">
				<MostRecentVideo
					thumbnail={data.last10Videos[0]?.thumbnail ?? ""}
					title={data.last10Videos?.[0]?.title ?? ""}
					url={data.last10Videos?.[0]?.url ?? ""}
					views="0"
				/>
				<ViewsComparisons data={data?.videoViews} />
			</div>
		</div>
	);
};
