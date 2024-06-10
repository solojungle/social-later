"use client";

import {
	ArrowDownRight,
	ArrowUpRight,
	InfoIcon,
	Loader2,
	Minus,
} from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { AudienceGrowth } from "../audienceGrowth";
import { MostRecentVideo } from "../mostRecentVideo";
import { ViewsComparisons } from "../viewsComparisons";

export const StatsCard = ({
	title,
	value,
	increasedBy,
	tooltip,
}: {
	title: string;
	value: string;
	increasedBy: string;
	tooltip: string;
}) => {
	let colorClass = "";
	let arrowIcon = null;

	const percentage = parseFloat(increasedBy.replace(/,/g, "")) / 100;

	if (percentage > 0) {
		// Make positive percentages green
		colorClass = "text-green-600";
		// Use ArrowUpRight for positive percentages
		arrowIcon = <ArrowUpRight className="h-4 w-4 text-green-600" />;
	} else if (percentage < 0) {
		// Make negative percentages red
		colorClass = "text-red-600";
		// Use ArrowDownRight for negative percentages
		arrowIcon = <ArrowDownRight className="h-4 w-4 text-red-600" />;
	} else {
		// Make neutral percentages blue
		colorClass = "text-blue-600";
		// Use ArrowDownRight for neutral percentages
		arrowIcon = <Minus className="h-4 w-4 text-blue-600" />;
	}

	return (
		<div className="flex flex-col px-2">
			<Tooltip delayDuration={0}>
				<TooltipTrigger className="mb-1 flex max-w-fit items-center gap-1 text-muted-foreground">
					<h2 className="text-xs">{title}</h2>
					<InfoIcon className="h-3 w-3" />
				</TooltipTrigger>
				<TooltipContent side="top" className="flex w-40 items-center gap-4">
					<p className="text-xs">{tooltip}</p>
				</TooltipContent>
			</Tooltip>
			<span className="mb-1 text-4xl font-light">{value}</span>
			<div className="flex items-center gap-px text-sm">
				{arrowIcon}
				<span className={colorClass}>
					{increasedBy} ({percentage}%)
				</span>
				{/* <span className="ml-1 truncate text-xs text-muted-foreground">
					vs {period}
				</span> */}
			</div>
		</div>
	);
};

export interface Increase {
	daily: string;
	weekly: string;
	monthly: string;
	annually: string;
}

export interface Totals {
	value: string;
	increase: Increase;
}

type AudienceGrowthProps = {
	values:
		| {
				views: Totals;
				subscribers: Totals;
		  }
		| undefined;
};

function PerformanceSummary({ values }: AudienceGrowthProps) {
	// While the data is loading, return null
	if (!values) {
		return null;
	}

	const { views, subscribers } = values;

	return (
		<div className="w-full rounded-sm border border-border p-3 text-sm">
			<div className="mb-8">
				<h2 className="font-medium">Performance Summary</h2>
				<p className="text-muted-foreground">
					View your key performance metrics from the reporting
				</p>
			</div>
			<div className="grid grid-cols-2 gap-6 divide-x lg:grid-cols-4 [&>*:nth-child(odd)]:border-none lg:[&>*:nth-child(odd)]:border-solid ">
				<StatsCard
					title="Views"
					value={views.value}
					increasedBy={views.increase.daily}
					tooltip="The total amount of views on your social profile."
				/>
				<StatsCard
					title="Subscribers"
					value={subscribers.value}
					increasedBy={subscribers.increase.daily}
					tooltip="The total amount of subscribers that your channel has."
				/>
				{/* <StatsCard
					title="Watch time (hours)"
					value={retweets.value.toString()}
					increasedBy={retweets.increase.daily.toString()}
					tooltip="The total amount of hours that people have viewed your posts."
				/> */}
				{/* <StatsCard
					title="Impressions"
					value={impressions.value.toString()}
					increasedBy={impressions.increase.daily.toString()}
					tooltip="The total amount of times that your posts have been seen by other users."
				/> */}
			</div>
		</div>
	);
}

export const YouTubeAnalyticsTab = () => {
	const { currentProfileId } = useSocialProfilesStore();

	const { data, isFetching, isError } =
		api.analytics.combinedYouTubeAnalytics.useQuery(
			{
				profileId: currentProfileId,
			},
			{
				enabled: !!currentProfileId,
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
			value: counts?.viewCount,
			increase: {
				daily: "0",
				weekly: "0",
				monthly: "0",
				annually: "0",
			},
		},
		subscribers: {
			value: counts?.subscriberCount,
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
				<PerformanceSummary values={performanceData} />
				<AudienceGrowth metrics={data?.historicalData} />
			</div>
			<div className="col-span-1 space-y-2">
				<MostRecentVideo
					thumbnail={data.last10Videos[0]?.thumbnail}
					title={data.last10Videos?.[0]?.title}
					url={data.last10Videos?.[0]?.url}
					views="0"
				/>
				<ViewsComparisons data={data?.videoViews} />
			</div>
		</div>
	);
};
