"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon, Minus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { AudienceGrowth } from "../audienceGrowth";
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
	daily: number;
	weekly: number;
	monthly: number;
	annually: number;
}

export interface Totals {
	value: number;
	increase: Increase;
}

type AudienceGrowthProps = {
	values:
		| {
				followers: Totals;
				profileClicks: Totals;
				retweets: Totals;
				replies: Totals;
				likes: Totals;
				quotes: Totals;
				impressions: Totals;
				urlClicks: Totals;
		  }
		| undefined;
};

function PerformanceSummary({ values }: AudienceGrowthProps) {
	// While the data is loading, return null
	if (!values) {
		return null;
	}

	const {
		retweets,
		likes,
		impressions,
		followers,
		// profileClicks,
		// replies,
		// quotes,
		// urlClicks,
	} = values;

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
					value={followers.value.toString()}
					increasedBy={followers.increase.daily.toString()}
					tooltip="The total amount of views on your social profile."
				/>
				<StatsCard
					title="Subscribers"
					value={likes.value.toString()}
					increasedBy={likes.increase.daily.toString()}
					tooltip="The total amount of subscribers that your channel has."
				/>
				<StatsCard
					title="Watch time (hours)"
					value={retweets.value.toString()}
					increasedBy={retweets.increase.daily.toString()}
					tooltip="The total amount of hours that people have viewed your posts."
				/>
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

	const { data: resp } = api.metrics.getPostMetrics.useQuery({
		id: "clvs5cszf000aso19af4tk5jx",
	});

	// const { data: ytResp } = api.socials.uploadYouTubeVideo.useQuery(
	// 	{
	// 		profileId: currentProfileId,
	// 	},
	// 	{
	// 		enabled: !!currentProfileId,
	// 	},
	// );

	const { mutateAsync: createBulkYouTubeReport } =
		api.socials.getBulkYouTubeReport.useMutation({
			onSuccess: () => {
				toast.success("Successfully called API.", {});
			},
		});

	return (
		<>
			<Button
				onClick={async () => {
					const { data: reportInfo } = await createBulkYouTubeReport({
						profileId: currentProfileId,
					});

					console.log(reportInfo);
				}}
			>
				Generate Bulk Report
			</Button>
			<PerformanceSummary values={resp?.totals} />
			<div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-2">
				<div className="col-span-2">
					<AudienceGrowth metrics={resp?.metrics} />
				</div>
				<div className="col-span-1">
					<ViewsComparisons />
				</div>
			</div>
		</>
	);
};
