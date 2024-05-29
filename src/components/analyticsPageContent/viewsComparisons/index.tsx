"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { cn } from "@/lib/utils";

function formatNumber(num: any) {
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

const CustomTooltip = ({
	active,
	payload,
}: {
	active: boolean;
	payload: { name: string; value: number }[];
}) => {
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
								{ "bg-red-600": name === "Long Views" },
								{ "bg-blue-600": name === "Short Views" },
							)}
						/>
						<p>Views</p>
					</div>
					<p className="font-medium text-foreground">{formatNumber(value)}%</p>
				</div>
			</div>
		);
	}

	return null;
};

export function ViewsComparisons() {
	const data = [
		{ name: "Long Views", value: 432323423 },
		{ name: "Short Views", value: 432323423 },
	];

	const longViews = data[0]?.value ?? 0;
	const shortViews = data[1]?.value ?? 0;

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
		<div className="h-full w-full rounded-sm border border-border p-3 text-sm">
			<div className="mb-8">
				<h2 className="font-medium">Long Format Video vs. Shorts Views</h2>
				<p className="text-muted-foreground">Last 365 Days - Estimated</p>
			</div>
			<div className="flex items-center justify-between">
				<div className="flex flex-col space-y-4">
					<div className="flex w-max items-center justify-center space-x-2">
						<div className="h-16 w-2 rounded-lg bg-red-600" />
						<div>
							<p className="line-clamp-1 text-xs">Long Views</p>
							<p className="text-lg font-medium">{formatNumber(longViews)}</p>
						</div>
					</div>
					<div className="flex w-max items-center justify-center space-x-2">
						<div className="h-16 w-2 rounded-lg bg-blue-600" />
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
							fill="#8884d8"
						>
							{[
								{ name: "Long Views", fill: "#ff0000" },
								{ name: "Short Views", fill: "#0000ff" },
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
