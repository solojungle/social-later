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

type AudienceGrowthProps = {
	metrics:
		| {
				id: string;
				date: Date;
				postId: string;
				profileClicks: number;
				retweets: number;
				replies: number;
				likes: number;
				quotes: number;
				impressions: number;
				urlClicks: number;
		  }[]
		| undefined;
};

export function formatData(metrics: AudienceGrowthProps["metrics"]) {
	if (!metrics) {
		return [];
	}

	// Filter data by period
	const filteredData = metrics
		.map((metric) => {
			const date = new Date(metric.date);
			const month = String(date.getMonth() + 1).padStart(2, "0");
			const day = String(date.getDate()).padStart(2, "0");
			const hours = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			const dateString = `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}`;

			return {
				date: dateString,
				value: metric.profileClicks,
			};
		})
		.sort((a, b) => {
			const dateA = new Date(a.date).getTime();
			const dateB = new Date(b.date).getTime();

			return dateA - dateB;
		});

	return filteredData;
}

function fitDataToPeriod(
	period: "daily" | "weekly" | "monthly" | "annually",
	data: { date: string; value: number }[],
) {
	const dates = [];

	if (period === "daily") {
		const start = new Date(new Date().setHours(0, 0, 0, 0));

		for (let hours = 0; hours <= 23; hours += 1) {
			const date = new Date(start.getTime() + hours * 60 * 60 * 1000);
			const hour = String(date.getHours()).padStart(2, "0");
			const minutes = String(date.getMinutes()).padStart(2, "0");
			const timeString = `${hour}:${minutes}`;

			const timeSlot = { date: timeString, value: 0 };
			dates.push(timeSlot);

			data.forEach((dataPoint) => {
				if (
					new Date(dataPoint.date).toISOString().slice(0, 13) ===
					new Date(date).toISOString().slice(0, 13)
				) {
					timeSlot.value = dataPoint.value;
				}
			});
		}

		dates.push({ date: "23:59", value: 0 });
	}

	// First 3 letters of month, followed by day of the month, last 7 days
	if (period === "weekly") {
		const start = new Date(new Date().setHours(0, 0, 0, 0));

		for (let days = 7; days > 0; days -= 1) {
			const date = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
			const month = date.toLocaleString("default", { month: "short" });
			const day = date.getDate();
			const dateString = `${month} ${day}`;

			const timeSlot = { date: dateString, value: 0 };
			dates.push(timeSlot);

			data.forEach((dataPoint) => {
				if (
					new Date(dataPoint.date).toISOString().slice(0, 10) ===
					new Date(date).toISOString().slice(0, 10)
				) {
					timeSlot.value = dataPoint.value;
				}
			});
		}
	}

	if (period === "monthly") {
		const start = new Date(new Date().setHours(0, 0, 0, 0));

		for (let days = 29; days >= 0; days -= 1) {
			const date = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
			const month = date.toLocaleString("default", { month: "short" });
			const day = date.getDate();
			const dateString = `${month} ${day}`;

			const timeSlot = { date: dateString, value: 0 };
			dates.push(timeSlot);

			data.forEach((dataPoint) => {
				if (
					new Date(dataPoint.date).toISOString().slice(0, 10) ===
					new Date(date).toISOString().slice(0, 10)
				) {
					timeSlot.value = dataPoint.value;
				}
			});
		}
	}

	// Just the first 3 letters of the month, last 13 months
	if (period === "annually") {
		const start = new Date(new Date().setHours(0, 0, 0, 0));

		for (let months = 12; months >= 0; months -= 1) {
			const date = new Date(start.getTime());
			date.setMonth(date.getMonth() - months);
			const month = date.toLocaleString("default", { month: "short" });

			const dateString = month;

			const timeSlot = { date: dateString, value: 0 };
			dates.push(timeSlot);

			data.forEach((dataPoint) => {
				if (
					new Date(dataPoint.date).toISOString().slice(0, 7) ===
					new Date(date).toISOString().slice(0, 7)
				) {
					timeSlot.value = dataPoint.value;
				}
			});
		}
	}

	return dates;
}

export function AudienceGrowth({ metrics }: AudienceGrowthProps) {
	const [period, setPeriod] = useState<
		"daily" | "weekly" | "monthly" | "annually"
	>("daily");

	if (!metrics) {
		return null;
	}

	const filteredData = formatData(metrics);
	const fittedData = fitDataToPeriod(period, filteredData);

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
					data={fittedData}
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
						dataKey="date"
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
						dataKey="value"
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
