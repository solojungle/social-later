"use client";

import { useState } from "react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
	XAxis,
	YAxis,
} from "recharts";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { ReportRangePicker } from "@/components/reportRangePicker";
import { DataTypePicker } from "@/components/youtubeDataTypePicker";
import { twColors } from "@/lib/tailwind";

const PRIMARY_COLOR = twColors?.primary?.DEFAULT as string;

function formatNumber(num: any) {
	return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function CustomTooltip({
	active,
	payload,
	label,
	type,
}: TooltipProps<ValueType, NameType> & { type: string }) {
	if (active && payload && payload.length) {
		return (
			<div className="w-36 rounded-md bg-background text-xs shadow-sm">
				<div className="rounded-t-sm border border-border bg-muted p-1">
					<p className="font-medium text-foreground">{label}</p>
				</div>
				<div className="flex items-center justify-between rounded-b-sm border border-t-0 border-border px-1 py-1.5">
					<div className="flex items-center justify-center">
						<div className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
						<p className="capitalize">{type}</p>
					</div>
					<p className="font-medium text-foreground">
						{payload?.[0] && formatNumber(payload?.[0].value)}
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
				views: string;
				comments: string;
				likes: string;
				dislikes: string;
				shares: string;
				watch_time_minutes: string;
				subscribers_gained: string;
				subscribers_lost: string;

				[key: string]: number | string | Date; // Add index signature
		  }[]
		| undefined;
};

export function formatData(
	metrics: AudienceGrowthProps["metrics"],
	type: string,
) {
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

			const value = metric[type] as number;
			if (value === undefined) {
				return {
					date: dateString,
					value: 0,
				};
			}

			return {
				date: dateString,
				value: metric[type] as number,
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
	const now = new Date().setHours(0, 0, 0, 0);
	const start = new Date(now);

	const addTimeSlot = (date: Date, format: any) => {
		const dateString = date.toLocaleString("default", format);
		const timeSlot = { date: dateString, value: 0 };
		dates.push(timeSlot);
		data.forEach((dataPoint) => {
			if (
				new Date(dataPoint.date)
					.toISOString()
					.startsWith(date.toISOString().slice(0, format.year ? 7 : 10))
			) {
				timeSlot.value = Number(dataPoint.value);
			}
		});
	};

	switch (period) {
		case "daily":
			for (let hours = 0; hours <= 23; hours += 1) {
				const date = new Date(start.getTime() + hours * 60 * 60 * 1000);
				addTimeSlot(date, { hour: "2-digit", minute: "2-digit" });
			}
			dates.push({ date: "23:59", value: 0 });
			break;

		case "weekly":
			for (let days = 6; days >= 0; days -= 1) {
				const date = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
				addTimeSlot(date, { month: "short", day: "numeric" });
			}
			break;

		case "monthly":
			for (let days = 29; days >= 0; days -= 1) {
				const date = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);
				addTimeSlot(date, { month: "short", day: "numeric" });
			}
			break;

		case "annually":
			for (let months = 12; months >= 0; months -= 1) {
				const date = new Date(start);
				date.setMonth(date.getMonth() - months);
				addTimeSlot(date, { month: "short", year: "numeric" });
			}
			break;
		default:
			break;
	}

	return dates;
}

export function AudienceGrowth({ metrics }: AudienceGrowthProps) {
	// This is the field that will be used to determine the type of data to display
	const [type, setType] = useState<"subscribers" | "views">("views");
	const [period, setPeriod] = useState<
		"daily" | "weekly" | "monthly" | "annually"
	>("weekly");

	if (!metrics) {
		return null;
	}

	const filteredData = formatData(metrics, type);
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
				<div className="flex space-x-1">
					<DataTypePicker type={type} onChange={setType} />
					<ReportRangePicker period={period} onChange={setPeriod} />
				</div>
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
						content={<CustomTooltip type={type} />}
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
