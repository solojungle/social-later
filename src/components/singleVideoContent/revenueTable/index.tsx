import { InfoIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

const defaultData = [
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
	},
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
		estimatedRevenue: 25000,
	},
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
		estimatedRevenue: 25000,
	},
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
		estimatedRevenue: 25000,
	},
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
		estimatedRevenue: 25000,
	},
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
		estimatedRevenue: 25000,
	},
	{
		id: "0uOMuXbsZPU",
		date: "01/01/2021",
		views: 1000,
		estimatedRevenue: 25000,
	},
];

const dailyAverage = defaultData.reduce(
	(acc, row) => {
		acc.views += row.views;
		acc.estimatedRevenue += row.estimatedRevenue;
		return acc;
	},
	{ views: 0, estimatedRevenue: 0 },
);

const weeklyAverage = defaultData.reduce(
	(acc, row) => {
		acc.views += row.views;
		acc.estimatedRevenue += row.estimatedRevenue;
		return acc;
	},
	{ views: 0, estimatedRevenue: 0 },
);

function formatPrice(amount: number | null, currency: string): string {
	if (amount === null) return "";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
}

export function RevenueTable() {
	return (
		<Card className="rounded-sm shadow-none">
			<CardHeader>
				<CardTitle>Daily Estimated Revenue</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col">
				<Table>
					<TableHeader className="text-xs">
						<TableRow>
							<TableHead>Date</TableHead>
							<TableHead>Views</TableHead>
							<TableHead className="text-right">
								<TooltipProvider>
									<Tooltip delayDuration={0}>
										<TooltipTrigger>
											<div className="flex items-center gap-1">
												<span>Estimated Revenue</span>
												<InfoIcon className="h-3 w-3" />
											</div>
										</TooltipTrigger>
										<TooltipContent side="top">
											Estimated Earnings CPM is between $0.25 and $4.00
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{defaultData.map((row) => (
							<TableRow key={row.id}>
								<TableCell>{row.date}</TableCell>
								<TableCell>{row.views.toLocaleString()}</TableCell>
								<TableCell className="text-right">
									{`${
										(formatPrice(row.views * 0.25, "USD"),
										+" - " + formatPrice(row.views * 4, "USD"))
									}`}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={2}>Daily Averages</TableCell>
							<TableCell className="text-right">
								{formatPrice(dailyAverage.estimatedRevenue, "USD")}
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell colSpan={2}>Weekly Averages</TableCell>
							<TableCell className="text-right">
								{formatPrice(weeklyAverage.estimatedRevenue, "USD")}
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</CardContent>
		</Card>
	);
}
