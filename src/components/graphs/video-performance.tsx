import { RefreshCw } from "lucide-react";
import { useState } from "react";
import {
	Area,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
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

// Assume we have this API call:
// getVideoPerformanceData(videoId: string, platform: string, timeRange: string): Promise<PerformanceData[]>
// Returns: [{ time: number, thisVideoViews: number, typicalPerformanceMin: number, typicalPerformanceMax: number }]

const defaultData = [
	{
		time: 0,
		thisVideoViews: 0,
		typicalPerformanceMin: 0,
		typicalPerformanceMax: 0,
	},
	{
		time: 24,
		thisVideoViews: 25000000,
		typicalPerformanceMin: 20000000,
		typicalPerformanceMax: 40000000,
	},
	{
		time: 48,
		thisVideoViews: 45000000,
		typicalPerformanceMin: 35000000,
		typicalPerformanceMax: 60000000,
	},
	{
		time: 72,
		thisVideoViews: 60000000,
		typicalPerformanceMin: 45000000,
		typicalPerformanceMax: 75000000,
	},
	{
		time: 96,
		thisVideoViews: 70000000,
		typicalPerformanceMin: 55000000,
		typicalPerformanceMax: 90000000,
	},
	{
		time: 120,
		thisVideoViews: 80000000,
		typicalPerformanceMin: 65000000,
		typicalPerformanceMax: 105000000,
	},
	{
		time: 144,
		thisVideoViews: 85000000,
		typicalPerformanceMin: 70000000,
		typicalPerformanceMax: 120000000,
	},
];

const chartConfig = {
	thisVideoViews: { label: "This video", color: "hsl(var(--chart-1))" },
	typicalPerformance: {
		label: "Typical performance",
		color: "hsl(var(--chart-2))",
	},
};

export function VideoPerformanceGraph({ videoId, platform }: any) {
	const [performanceData, setPerformanceData] = useState(defaultData);
	const [timeRange, setTimeRange] = useState("since-published");
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	//   fetchPerformanceData();
	// }, [videoId, platform, timeRange]);

	// const fetchPerformanceData = async () => {
	//   setLoading(true);
	//   const data = await getVideoPerformanceData(videoId, platform, timeRange);
	//   setPerformanceData(data);
	//   setLoading(false);
	// };

	const formatYAxis = (value: number) => {
		if (value >= 1000000) return `${value / 1000000}M`;
		if (value >= 1000) return `${value / 1000}K`;
		return value.toString();
	};

	const formatXAxis = (value: number) => `${value} hours`;

	return (
		<Card className="rounded-sm shadow-none">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Performance Over Time</CardTitle>
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="icon">
						<RefreshCw
							className={`h-4 w-4 cursor-pointer ${
								loading ? "animate-spin" : ""
							}`}
							// onClick={() =>
							// 	fetchPerformanceData(
							// 		videoId,
							// 		platform,
							// 		timeRange,
							// 		setPerformanceData,
							// 		setLoading,
							// 	)
							// }
						/>
					</Button>

					<Select value={timeRange} onValueChange={setTimeRange}>
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="since-published">Since published</SelectItem>
							<SelectItem value="last-48-hours">Last 48 hours</SelectItem>
							<SelectItem value="last-7-days">Last 7 days</SelectItem>
							<SelectItem value="last-28-days">Last 28 days</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={performanceData}>
								<defs>
									<linearGradient id="colorTypical" x1="0" y1="0" x2="0" y2="1">
										<stop
											offset="5%"
											stopColor="var(--color-typicalPerformance)"
											stopOpacity={0.8}
										/>
										<stop
											offset="95%"
											stopColor="var(--color-typicalPerformance)"
											stopOpacity={0.1}
										/>
									</linearGradient>
								</defs>
								<CartesianGrid vertical={false} strokeDasharray="3 3" />
								<XAxis
									dataKey="time"
									tickFormatter={formatXAxis}
									axisLine={false}
									tickLine={false}
									tickMargin={8}
									minTickGap={32}
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
											labelFormatter={(value) => `${value} hours`}
											indicator="dot"
											separator=" - "
										/>
									}
								/>
								<Area
									type="monotone"
									dataKey="typicalPerformanceMax"
									stroke="var(--color-typicalPerformance)"
									strokeWidth={0}
									fillOpacity={1}
									fill="url(#colorTypical)"
								/>
								<Line
									type="monotone"
									dataKey="thisVideoViews"
									stroke="var(--color-thisVideoViews)"
									strokeWidth={2}
									dot={false}
									name="This video"
								/>
							</LineChart>
						</ResponsiveContainer>
						<ChartLegend>
							<ChartLegendContent />
						</ChartLegend>
					</>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
