import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const defaultData = [
	{
		date: new Date(),
		views: 0,
	},
];

const chartConfig = {
	views: {
		label: "views",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

// We add the views of each day
function cumulativeSum(data: any) {
	return data.reduce((acc: any, curr: any) => {
		const last = acc[acc.length - 1] || { views: 0 };
		acc.push({ ...curr, views: curr.views + last.views });
		return acc;
	}, []);
}

export function VideoPerformanceGraph({ passedData }: any) {
	const data = passedData || defaultData;

	const [timeRange, setTimeRange] = useState("since-published");

	const cumulativeData = useMemo(() => cumulativeSum(data), [data]);

	const performanceData = useMemo(() => {
		if (timeRange === "last-7-days") {
			return cumulativeData.slice(-7);
		}
		if (timeRange === "last-28-days") {
			return cumulativeData.slice(-28);
		}
		return cumulativeData;
	}, [timeRange, cumulativeData]);

	const formatYAxis = (value: number) => {
		if (value >= 1000000) return `${value / 1000000}M`;
		if (value >= 1000) return `${value / 1000}K`;
		return value.toString();
	};

	const formatXAxis = (value: number) => {
		const date = new Date(value);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<Card className="rounded-sm shadow-none">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Performance Over Time</CardTitle>
				<div className="flex items-center space-x-2">
					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="since-published">Since published</SelectItem>
							<SelectItem value="last-7-days">Last 7 days</SelectItem>
							<SelectItem value="last-28-days">Last 28 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<LineChart
						data={performanceData}
						accessibilityLayer
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} strokeDasharray="3 3" />
						<XAxis
							dataKey="date"
							tickFormatter={formatXAxis}
							axisLine={false}
							tickLine={false}
							tickMargin={8}
						/>
						<YAxis
							tickFormatter={formatYAxis}
							axisLine={false}
							tickLine={false}
						/>
						<ChartTooltip
							cursor={{ strokeDasharray: "3 3" }}
							content={
								<ChartTooltipContent
									labelFormatter={formatXAxis}
									indicator="dot"
									separator=" - "
								/>
							}
						/>

						<Line
							name="views"
							dataKey="views"
							stroke="var(--color-views)"
							type="monotone"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}

// Really liked this concept for a button
// <Button variant="ghost" size="icon">
// 		<RefreshCw
// 			className={`h-4 w-4 cursor-pointer ${
// 				loading ? "animate-spin" : ""
// 			}`}
// 			// onClick={() =>
// 			// 	fetchPerformanceData(
// 			// 		videoId,
// 			// 		platform,
// 			// 		timeRange,
// 			// 		setPerformanceData,
// 			// 		setLoading,
// 			// 	)
// 			// }
// 		/>
// 	</Button>
