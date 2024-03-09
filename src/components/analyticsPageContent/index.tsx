"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon } from "lucide-react";
import {
	Bar,
	BarChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";

import { ResizablePanel } from "../ui/resizable";
import { Separator } from "../ui/separator";

const data = [
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

const pieData = [
	{ name: "Group A", value: 400 },
	{ name: "Group B", value: 300 },
	{ name: "Group C", value: 300 },
	{ name: "Group D", value: 200 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
	index,
}) => {
	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

export const StatsCard = ({
	title,
	value,
	increasedBy,
	percentage,
	period,
}: {
	title: string;
	value: string;
	increasedBy: string;
	percentage: number;
	period: string;
}) => {
	let colorClass = "";
	let arrowIcon = null;

	if (percentage > 0) {
		// Make positive percentages green
		colorClass = "text-green-600";
		// Use ArrowUpRight for positive percentages
		arrowIcon = <ArrowUpRight className="h-4 w-4 text-green-600" />;
	} else if (percentage < 0) {
		// Make negative percentages red
		colorClass = "text-red-600";
		// Use ArrowDownRight for negative percentages
		arrowIcon = <ArrowDownRight className="h-4 w-4 text-red-600" />;
	} else {
		// Make neutral percentages blue
		colorClass = "text-blue-600";
		// Use ArrowDownRight for neutral percentages
		arrowIcon = <ArrowDownRight className="h-4 w-4 text-blue-600" />;
	}

	return (
		<div className="flex flex-col rounded-lg border border-border p-5">
			<div className="mb-3 flex items-center gap-1 text-muted-foreground">
				<h2 className="text-sm">{title}</h2>
				<InfoIcon className="h-4 w-4" />
			</div>
			<span className="mb-1 text-3xl font-medium">{value}</span>
			<div className="flex items-center gap-px text-sm">
				{arrowIcon}
				<span className={colorClass}>
					{increasedBy} ({percentage}%)
				</span>
				<span className="ml-1 truncate text-xs text-muted-foreground">
					vs {period}
				</span>
			</div>
		</div>
	);
};

export const AnalyticsPageContent = () => {
	return (
		<ResizablePanel
			id="analytics"
			order={2}
			defaultSize={80}
			className="space-y-4 !overflow-scroll p-3 pb-48"
		>
			<div className="mb-6">
				<h3 className="text-lg font-medium">Analytics</h3>
				<p className="text-sm text-muted-foreground">
					Customize your analytics view. Select your preferred data range and
					visualizations.
				</p>
			</div>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<StatsCard
					title="Followers"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
				<StatsCard
					title="Likes"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
				<StatsCard
					title="Impressions"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
				<StatsCard
					title="Followers"
					value="12,345"
					increasedBy="2,345"
					percentage="20.1"
					period="yesterday"
				/>
			</div>
			<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
				<div className="flex flex-col rounded-lg border border-border p-5">
					<div className="mb-2 space-y-2">
						<span className="w-full text-xs font-medium text-muted-foreground">
							Followers Overtime
						</span>
						<Separator />
					</div>
					<ResponsiveContainer width="100%" height={350}>
						<BarChart data={data}>
							<XAxis
								dataKey="name"
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								stroke="#888888"
								fontSize={12}
								tickLine={false}
								axisLine={false}
								tickFormatter={(value) => `$${value}`}
							/>
							<Bar
								dataKey="total"
								fill="currentColor"
								radius={[4, 4, 0, 0]}
								className="fill-primary"
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
				<div className="flex flex-col rounded-lg border border-border p-5">
					<div className="mb-2 space-y-2">
						<span className="w-full text-xs font-medium text-muted-foreground">
							Followers Per Social Profile
						</span>
						<Separator />
					</div>
					<ResponsiveContainer width="100%" height={350}>
						<PieChart width={400} height={400}>
							<Pie
								data={pieData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={renderCustomizedLabel}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{data.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={COLORS[index % COLORS.length]}
									/>
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</ResizablePanel>
	);
};
