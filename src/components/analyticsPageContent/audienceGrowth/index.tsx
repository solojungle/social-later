"use client";

import { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import { ReportRangePicker } from "@/components/reportRangePicker";
import { cn } from "@/lib/utils";

const PRIMARY_COLOR = "#2563eb";

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

function formatNumber(num: number) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function CustomTooltip({
	active,
	payload,
	label,
}: {
	active: boolean;
	payload: any;
	label: string;
}) {
	if (active && payload && payload.length) {
		return (
			<div className="w-36 rounded-md bg-background text-xs shadow-sm">
				<div className="rounded-t-sm border border-border bg-muted p-1">
					<p className="font-medium text-foreground">{label}</p>
				</div>
				<div className="flex items-center justify-between rounded-b-sm border border-t-0 border-border px-1 py-1.5">
					<div className="flex items-center justify-center">
						<div
							className={cn(
								"mr-1.5 h-2 w-2 rounded-full",
								`bg-[${PRIMARY_COLOR}]`,
							)}
						/>
						<p>Followers</p>
					</div>
					<p className="font-medium text-foreground">
						{formatNumber(payload[0].value)}
					</p>
				</div>
			</div>
		);
	}

	return null;
}

function CustomActiveDot({ cx, cy }: { cx: number; cy: number }) {
	return (
		<circle
			cx={cx}
			cy={cy}
			r={5}
			stroke="white"
			strokeWidth={2}
			style={{ filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.4))" }}
			fill={PRIMARY_COLOR}
		/>
	);
}

export function AudienceGrowth() {
	const [period, setPeriod] = useState<
		"daily" | "weekly" | "monthly" | "annually"
	>("daily");

	return (
		<div className="w-full rounded-sm border border-border p-3 text-sm">
			<div className="mb-8 flex justify-between">
				<div>
					<h2 className="font-medium">Audience Growth</h2>
					<p className="text-muted-foreground">
						See how your audience grew during the reporting period
					</p>
				</div>
				<ReportRangePicker period={period} onChange={setPeriod} />
			</div>
			<ResponsiveContainer width="100%" height={350}>
				<AreaChart
					data={areaChartData}
					margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
				>
					<defs>
						<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8} />
							<stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid
						className="stroke-border"
						vertical={false}
						syncWithTicks
					/>
					<XAxis
						dataKey="name"
						fontSize={12}
						tickLine={false}
						axisLine={false}
						padding={{ left: 10, right: 10 }} // Added padding
					/>
					<YAxis
						fontSize={12}
						tickLine={false}
						axisLine={false}
						padding={{ top: 10, bottom: 10 }} // Added padding
						tickFormatter={(value) => formatNumber(value)}
					/>
					<Tooltip
						content={CustomTooltip}
						cursor={{ strokeWidth: 1 }}
						animationDuration={75}
					/>
					<Area
						isAnimationActive={false}
						stroke={PRIMARY_COLOR}
						activeDot={CustomActiveDot}
						dataKey="total"
						strokeWidth={1}
						type="monotone"
						fill="url(#colorUv)"
						fillOpacity={1}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
