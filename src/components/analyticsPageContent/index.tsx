"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon, Minus } from "lucide-react";

import { useSocialProfilesStore } from "@/stores/social-profiles";

import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { ResizablePanel } from "../ui/resizable";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { TwitterAnalyticsTab } from "./tabs/twitter";
import { YouTubeAnalyticsTab } from "./tabs/youtube";

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

// type AudienceGrowthProps = {
// 	values:
// 		| {
// 				followers: Totals;
// 				profileClicks: Totals;
// 				retweets: Totals;
// 				replies: Totals;
// 				likes: Totals;
// 				quotes: Totals;
// 				impressions: Totals;
// 				urlClicks: Totals;
// 		  }
// 		| undefined;
// };

export const AnalyticsPageContent = () => {
	const { profiles, currentProfileId } = useSocialProfilesStore();

	const currentProfile = profiles.find(
		(profile) => profile.id === currentProfileId,
	);

	const profileType = currentProfile?.type;

	return (
		<ResizablePanel
			id="analytics"
			order={2}
			defaultSize={80}
			className="space-y-2 !overflow-scroll p-3 pb-48"
		>
			<div className="mb-6">
				<h3 className="text-lg font-medium">Analytics</h3>
				<p className="mb-6 text-sm text-muted-foreground">
					Customize your analytics view. Select your preferred data range and
					visualizations.
				</p>
				<SocialProfileSwitcher />
				<Separator className="my-6" />
			</div>
			{profileType === "twitter" && <TwitterAnalyticsTab />}
			{profileType === "youtube" && <YouTubeAnalyticsTab />}
		</ResizablePanel>
	);
};
