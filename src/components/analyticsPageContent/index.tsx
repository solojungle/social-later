"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon } from "lucide-react";

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

const areaChartData = [
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

const pieData = [
	{ name: "Group A", value: 400 },
	{ name: "Group B", value: 300 },
	{ name: "Group C", value: 300 },
	{ name: "Group D", value: 200 },
];

const COLORS = ["#475569", "#6B7280", "#9CA3AF", "#475569"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

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
		arrowIcon = <ArrowDownRight className="h-4 w-4 text-blue-600" />;
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

function PerformanceSummary() {
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
					value="12,345"
					increasedBy="2,123"
					period="yesterday"
					tooltip="The total number of followers on your social profile."
				/>
				<StatsCard
					title="Retweets"
					value="2,345"
					increasedBy="324"
					period="yesterday"
					tooltip="The total number of followers on your social profile."
				/>
				<StatsCard
					title="Likes"
					value="100,012"
					increasedBy="6,238"
					period="yesterday"
					tooltip="The total number of followers on your social profile."
				/>
				<StatsCard
					title="Impressions"
					value="220,360"
					increasedBy="12,127"
					period="yesterday"
					tooltip="The total number of followers on your social profile."
				/>
			</div>
		</div>
	);
}

export const AnalyticsPageContent = () => {
	// const { data: resp } = api.metrics.getPostMetrics.useQuery({
	// 	id: "clvs5cszf000aso19af4tk5jx",
	// });

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
			<PerformanceSummary />
			<div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-2">
				<div className="col-span-2">
					<AudienceGrowth />
				</div>
				<div className="col-span-1">
					<DeviceVisits />
				</div>
			</div>
		</ResizablePanel>
	);
};
