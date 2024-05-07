"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon, Minus } from "lucide-react";

import { api } from "@/trpc/react";

import { ResizablePanel } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AudienceGrowth } from "./audienceGrowth";
import { DeviceVisits } from "./deviceVisits";

const data = [
	{
		name: "Jan",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Feb",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Mar",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Apr",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "May",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Jun",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Jul",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Aug",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Sep",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Oct",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Nov",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
	{
		name: "Dec",
		total: Math.floor(Math.random() * 5000) + 1000,
	},
];

export const StatsCard = ({
	title,
	value,
	increasedBy,
	period,
	tooltip,
}: {
	title: string;
	value: string;
	increasedBy: string;
	period: string;
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
					title="Followers"
					value={followers.value.toString()}
					increasedBy={followers.increase.daily.toString()}
					period="yesterday"
					tooltip="The total amount of followers on your social profile."
				/>
				<StatsCard
					title="Retweets"
					value={retweets.value.toString()}
					increasedBy={retweets.increase.daily.toString()}
					period="yesterday"
					tooltip="The total amount of retweets that your posts have received."
				/>
				<StatsCard
					title="Likes"
					value={likes.value.toString()}
					increasedBy={likes.increase.daily.toString()}
					period="yesterday"
					tooltip="The total amount of likes that your posts have received."
				/>
				<StatsCard
					title="Impressions"
					value={impressions.value.toString()}
					increasedBy={impressions.increase.daily.toString()}
					period="yesterday"
					tooltip="The total amount of times that your posts have been seen by users."
				/>
			</div>
		</div>
	);
}

export const AnalyticsPageContent = () => {
	const { data: resp } = api.metrics.getPostMetrics.useQuery({
		id: "clvs5cszf000aso19af4tk5jx",
	});

	return (
		<ResizablePanel
			id="analytics"
			order={2}
			defaultSize={80}
			className="space-y-2 !overflow-scroll p-3 pb-48"
		>
			<div className="mb-6">
				<h3 className="text-lg font-medium">Analytics</h3>
				<p className="text-sm text-muted-foreground">
					Customize your analytics view. Select your preferred data range and
					visualizations.
				</p>
				<Separator className="my-6" />
			</div>
			<PerformanceSummary values={resp?.totals} />
			<div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-2">
				<div className="col-span-2">
					<AudienceGrowth metrics={resp?.metrics} />
				</div>
				<div className="col-span-1">
					<DeviceVisits />
				</div>
			</div>
		</ResizablePanel>
	);
};
