"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon } from "lucide-react";

import { ResizablePanel } from "../ui/resizable";

export const StatsCard = ({
	title,
	value,
	increasedBy,
	percentage,
	period,
}: {
	title: string;
	value: string;
	increasedBy: string;
	percentage: number;
	period: string;
}) => {
	let colorClass = "";
	let arrowIcon = null;

	if (percentage > 0) {
		// Make positive percentages green
		colorClass = "text-green-500";
		// Use ArrowUpRight for positive percentages
		arrowIcon = <ArrowUpRight className="h-4 w-4 text-green-500" />;
	} else if (percentage < 0) {
		// Make negative percentages red
		colorClass = "text-red-500";
		// Use ArrowDownRight for negative percentages
		arrowIcon = <ArrowDownRight className="h-4 w-4 text-red-500" />;
	} else {
		// Make neutral percentages blue
		colorClass = "text-blue-500";
		// Use ArrowDownRight for neutral percentages
		arrowIcon = <ArrowDownRight className="h-4 w-4 text-blue-500" />;
	}

	return (
		<div className="flex flex-col rounded-lg border-2 border-border p-5">
			<div className="mb-3 flex items-center gap-1 text-muted-foreground">
				<h2 className="text-sm">{title}</h2>
				<InfoIcon className="h-4 w-4" />
			</div>
			<span className="mb-1 text-3xl font-medium">{value}</span>
			<div className="flex items-center gap-px text-sm">
				{arrowIcon}
				<span className={colorClass}>
					{increasedBy} ({percentage}%)
				</span>
				<span className="ml-1 truncate text-xs text-muted-foreground">
					vs {period}
				</span>
			</div>
		</div>
	);
};

export const AnalyticsPageContent = () => {
	return (
		<ResizablePanel id="analytics" order={2} defaultSize={80} className="p-3">
			<div className="mb-6">
				<h3 className="text-lg font-medium">Analytics</h3>
				<p className="text-sm text-muted-foreground">
					Customize your analytics view. Select your preferred data range and
					visualizations.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<StatsCard
					title="Followers"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
				<StatsCard
					title="Followers"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
				<StatsCard
					title="Followers"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
				<StatsCard
					title="Followers"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
			</div>
		</ResizablePanel>
	);
};
