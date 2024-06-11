"use client";

import { ArrowDownRight, ArrowUpRight, InfoIcon, Minus } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const StatsCard = ({
	title,
	value,
	increasedBy,
	tooltip,
}: {
	title: string;
	value: string;
	increasedBy: string;
	tooltip: string;
}) => {
	let colorClass = "";
	let arrowIcon = null;

	const percentage = parseFloat(increasedBy.replace(/,/g, "")) / 100;

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
		arrowIcon = <Minus className="h-4 w-4 text-blue-600" />;
	}

	return (
		<div className="flex flex-col px-2">
			<Tooltip delayDuration={0}>
				<TooltipTrigger className="mb-1 flex max-w-fit items-center gap-1 text-muted-foreground">
					<h2 className="text-xs">{title}</h2>
					<InfoIcon className="h-3 w-3" />
				</TooltipTrigger>
				<TooltipContent side="top" className="flex w-40 items-center gap-4">
					<p className="text-xs">{tooltip}</p>
				</TooltipContent>
			</Tooltip>
			<span className="mb-1 text-4xl font-light">{value}</span>
			<div className="flex items-center gap-px text-sm">
				{arrowIcon}
				<span className={colorClass}>
					{increasedBy} ({percentage}%)
				</span>
			</div>
		</div>
	);
};
