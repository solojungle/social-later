"use client";

import { api } from "@/trpc/react";

import { DeviceVisits } from "../deviceVisits";
import { StatsCard } from "../statsCard";

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
					tooltip="The total amount of followers on your social profile."
				/>
				<StatsCard
					title="Retweets"
					value={retweets.value.toString()}
					increasedBy={retweets.increase.daily.toString()}
					tooltip="The total amount of retweets that your posts have received."
				/>
				<StatsCard
					title="Likes"
					value={likes.value.toString()}
					increasedBy={likes.increase.daily.toString()}
					tooltip="The total amount of likes that your posts have received."
				/>
				<StatsCard
					title="Impressions"
					value={impressions.value.toString()}
					increasedBy={impressions.increase.daily.toString()}
					tooltip="The total amount of times that your posts have been seen by users."
				/>
			</div>
		</div>
	);
}

export const TwitterAnalyticsTab = () => {
	const { data: resp } = api.metrics.getPostMetrics.useQuery({
		id: "clvs5cszf000aso19af4tk5jx",
	});

	return (
		<>
			<PerformanceSummary values={resp?.totals} />
			<div className="grid grid-cols-1 gap-y-2 lg:grid-cols-3 lg:gap-2">
				<div className="col-span-2">
					{/* <AudienceGrowth metrics={resp?.metrics} /> */}
				</div>
				<div className="col-span-1">
					<DeviceVisits />
				</div>
			</div>
		</>
	);
};
