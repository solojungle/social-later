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
		date: new Date(),
		views: 0,
	},
];

function formatPrice(amount: number | null, currency: string): string {
	if (amount === null) return "";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount / 100);
}

export function RevenueTable({ passedData }: any) {
	const data = passedData || defaultData;

	const dailyAverage = data.reduce(
		(acc: any, row: any) => {
			acc.estimatedRevenue += row.views * 2;
			return acc;
		},
		{ estimatedRevenue: 0 },
	);

	const weeklyAverage = data.reduce(
		(acc: any, row: any) => {
			acc.estimatedRevenue += row.views * 2;
			return acc;
		},
		{ estimatedRevenue: 0 },
	);

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
										<TooltipContent
											side="top"
											collisionPadding={{
												top: 5,
												right: 5,
												bottom: 5,
												left: 5,
											}}
										>
											Estimated Earnings CPM is between $0.25 and $4.00
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className="text-xs">
						{data.map((row: any) => {
							const low = row.views * 0.25;
							const high = row.views * 4;

							const range = `${formatPrice(low, "USD")} - ${formatPrice(
								high,
								"USD",
							)}`;

							return (
								<TableRow key={row.id}>
									<TableCell>
										{new Intl.DateTimeFormat("en-US", {
											year: "2-digit",
											month: "2-digit",
											day: "2-digit",
										}).format(new Date(row.date))}
									</TableCell>
									<TableCell>{row.views.toLocaleString()}</TableCell>
									<TableCell className="text-right">{range}</TableCell>
								</TableRow>
							);
						})}
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
