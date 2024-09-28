"use client";

import { AudienceGrowth } from "@/components/graphs/audience-growth";
import { ViewsComparisons } from "@/components/graphs/view-comparisons";
import { InterfaceIcons } from "@/components/ui/icons";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { MostRecentVideo } from "../mostRecentVideo";
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
			<div className="flex h-96 flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
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
			<TooltipProvider>
				<div className="col-span-2 space-y-2">
					<YouTubePerformanceSummary values={performanceData} />
					<AudienceGrowth metrics={data?.historicalData} />
				</div>
				<div className="col-span-1 space-y-2">
					<MostRecentVideo
						id={data.last10Videos[0]?.id ?? ""}
						thumbnail={data.last10Videos[0]?.thumbnail ?? ""}
						title={data.last10Videos?.[0]?.title ?? ""}
						url={data.last10Videos?.[0]?.url ?? ""}
						views={String(data.last10Videos?.[0]?.views)}
					/>
					<ViewsComparisons data={data?.videoViews} />
				</div>
			</TooltipProvider>
		</div>
	);
};
