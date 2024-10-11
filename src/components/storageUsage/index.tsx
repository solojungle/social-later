import { Progress } from "@/components/ui/progress";

import { InterfaceIcons } from "../ui/icons";

export function PlanUsage() {
	// For demo purposes, using static values
	const used = 3;
	const total = 5;
	const progress = (used / total) * 100;

	return (
		<div className="rounded-lg border border-border p-3 transition-all ">
			<div className="mb-1.5 flex w-64 flex-1 justify-between text-sm">
				<div className="flex items-center gap-2">
					<InterfaceIcons.Socials.YouTube className="size-4" />
					<span className="text-xs font-semibold">YouTube</span>
				</div>
				<span className="text-xs text-muted-foreground">
					{used} / {total} Posts
				</span>
			</div>
			<Progress value={progress} className="h-2 transition-all" />
		</div>
	);
}
