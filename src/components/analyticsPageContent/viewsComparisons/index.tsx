"use client";

import {
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	TooltipProps,
} from "recharts";
import {
	NameType,
	ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { twColors } from "@/lib/tailwind";
import { cn } from "@/lib/utils";

export function formatNumber(num: any) {
	// return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	const numString = num.toString();
	const numLength = numString.length;

	if (numLength < 4) {
		return numString;
	}

	if (numLength < 7) {
		return `${numString.slice(0, -3)}K`;
	}

	if (numLength < 10) {
		return `${(num / 1000000).toFixed(1)}M`;
	}

	if (numLength < 13) {
		return `${(num / 1000000000).toFixed(1)}B`;
	}

	if (numLength < 16) {
		return `${(num / 1000000000000).toFixed(1)}T`;
	}

	return numString;
}

const PRIMARY_COLOR = twColors?.primary?.DEFAULT as string;
const SECONDARY_COLOR = twColors?.secondary?.DEFAULT as string;

const CustomTooltip = ({
	active,
	payload,
}: TooltipProps<ValueType, NameType>) => {
	if (active && payload && payload.length) {
		if (!payload[0]) {
			return null;
		}

		const { name, value } = payload[0];

		return (
			<div className="w-28 rounded-md bg-background text-xs shadow-sm">
				<div className="rounded-t-sm border border-border bg-muted p-1">
					<p className="font-medium text-foreground">{name}</p>
				</div>
				<div className="flex items-center justify-between rounded-b-sm border border-t-0 border-border px-1 py-1.5">
					<div className="flex items-center justify-center">
						<div
							className={cn(
								"mr-1.5 h-2 w-2 rounded-full",
								{ "bg-primary": name === "Long Views" },
								{ "bg-secondary": name === "Short Views" },
							)}
						/>
						<p>Views</p>
					</div>
					<p className="font-medium text-foreground">
						{(value ?? "0")
							.toString()
							.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
						%
					</p>
				</div>
			</div>
		);
	}

	return null;
};

type ViewsProps = {
	data: {
		shorts: string;
		long: string;
		stories: string;
		liveStreams: string;
		other: string;
	};
};

export function ViewsComparisons({ data }: ViewsProps) {
	const longViews = Number(data?.long) ?? 0;
	const shortViews = Number(data?.shorts) ?? 0;

	const percentages = [
		{
			name: "Long Views",
			value: Number(((longViews / (longViews + shortViews)) * 100).toFixed(1)),
		},
		{
			name: "Short Views",
			value: Number(((shortViews / (longViews + shortViews)) * 100).toFixed(1)),
		},
	];

	return (
		<div className="w-full rounded-sm border border-border p-3 text-sm">
			<div className="mb-8">
				<h2 className="font-medium">Long Format Video vs. Shorts Views</h2>
				<p className="text-muted-foreground">Last 365 Days - Estimated</p>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex flex-col space-y-4">
					<div className="flex w-max items-center justify-center space-x-2">
						<div className="h-16 w-2 rounded-lg bg-primary" />
						<div>
							<p className="line-clamp-1 text-xs">Long Views</p>
							<p className="text-lg font-medium">{formatNumber(longViews)}</p>
						</div>
					</div>
					<div className="flex w-max items-center justify-center space-x-2">
						<div className="h-16 w-2 rounded-lg bg-secondary" />
						<div>
							<p className="line-clamp-1 text-xs">Short Views</p>
							<p className="text-lg font-medium">{formatNumber(shortViews)}</p>
						</div>
					</div>
				</div>
				<ResponsiveContainer height={200}>
					<PieChart>
						<Pie
							data={percentages}
							dataKey="value"
							nameKey="name"
							cx="50%"
							cy="50%"
							outerRadius={100}
							innerRadius={70}
						>
							{[
								{ name: "Long Views", fill: PRIMARY_COLOR },
								{ name: "Short Views", fill: SECONDARY_COLOR },
							].map((entry, index) => (
								<Cell key={`cell-${index}`} fill={entry.fill} />
							))}
						</Pie>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{ strokeWidth: 1 }}
							animationDuration={75}
						/>
					</PieChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
