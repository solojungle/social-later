import { HardDrive } from "lucide-react";

import { Progress } from "@/components/ui/progress";

export function PlanUsage() {
	// For demo purposes, using static values
	const used = 0.5;
	const total = 5;
	const progress = (used / total) * 100;
	const remaining = total - used;

	return (
		<div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
			<div className="flex items-center gap-3">
				<div className="rounded-full bg-primary/10 p-2">
					<HardDrive className="h-5 w-5 text-primary" />
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between">
						<h3 className="font-medium">Storage Usage</h3>
						<p className="text-sm font-medium">
							{used} GB / {total} GB
						</p>
					</div>

					<div className="mt-4">
						<Progress value={progress} className="h-2 transition-all" />
					</div>

					<div className="mt-2 flex justify-between text-sm text-muted-foreground">
						<div className="flex flex-col">
							<span>{used} GB</span>
							<span className="text-xs">Used</span>
						</div>
						<div className="flex flex-col text-right">
							<span>{remaining} GB</span>
							<span className="text-xs">Remaining</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
