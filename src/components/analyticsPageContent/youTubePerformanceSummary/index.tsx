import { StatsCard } from "../statsCard";

type AudienceGrowthProps = {
  values:
    | {
        subscribers: Totals;
        views: Totals;
      }
    | undefined;
};

interface Increase {
  annually: string;
  daily: string;
  monthly: string;
  weekly: string;
}

interface Totals {
  increase: Increase;
  value: string;
}

export function YouTubePerformanceSummary({ values }: AudienceGrowthProps) {
  // While the data is loading, return null
  if (!values) {
    return null;
  }

  const { subscribers, views } = values;

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
          increasedBy={views.increase.daily}
          title="Views"
          tooltip="The total amount of views on your social profile."
          value={views.value}
        />
        <StatsCard
          increasedBy={subscribers.increase.daily}
          title="Subscribers"
          tooltip="The total amount of subscribers that your channel has."
          value={subscribers.value}
        />
      </div>
    </div>
  );
}
