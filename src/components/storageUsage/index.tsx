import { Progress } from "@/components/ui/progress";

import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";

function Usage({
	used,
	total,
	unit,
	label,
	Icon,
}: {
	used: number;
	total: number;
	unit: string;
	label: string;
	Icon: any;
}) {
	const progress = (used / total) * 100;
	return (
		<>
			<div className="mb-1.5 flex w-64 flex-1 justify-between text-sm">
				<div className="flex items-center gap-2">
					<Icon className="size-4" />
					<span className="text-xs font-normal">{label}</span>
				</div>
				<span className="text-xs text-muted-foreground">
					{used} / {total} {unit}
				</span>
			</div>
			<Progress value={progress} className="h-2 transition-all" />
		</>
	);
}

export function PlanUsage({
	used,
	total,
	unit,
	label,
	logo,
}: {
	used: number;
	total: number;
	unit: string;
	label: string;
	logo: string;
}) {
	return (
		// <div className="rounded-lg border border-border p-4 transition-all ">
		<>
			<div className="mb-4 flex flex-1 items-center justify-between">
				<h2 className="text-sm font-semibold">Plan Usage</h2>
			</div>
			<div className="mb-6 space-y-2">
				<Usage
					used={used}
					total={100}
					unit="GB"
					label="Storage"
					Icon={InterfaceIcons.Archive}
				/>
				<Usage
					used={used}
					total={5}
					unit="Posts"
					label="YouTube"
					Icon={InterfaceIcons.Socials.YouTube}
				/>
				<Usage
					used={used}
					total={250}
					unit="Posts"
					label="Threads"
					Icon={InterfaceIcons.Socials.Threads}
				/>
			</div>
			<Button size="sm" className="mb-2 w-full">
				Change Plan
			</Button>
			<span className="text-xs text-muted-foreground">
				Your plan renews on 12/12/2022
			</span>
		</>
	);
}
