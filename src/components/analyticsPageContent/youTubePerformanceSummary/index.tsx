import { StatsCard } from "../statsCard";

interface Increase {
	daily: string;
	weekly: string;
	monthly: string;
	annually: string;
}

interface Totals {
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

export function YouTubePerformanceSummary({ values }: AudienceGrowthProps) {
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
			</div>
		</div>
	);
}
