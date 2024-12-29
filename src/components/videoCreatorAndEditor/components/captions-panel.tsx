"use client";

import { Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CaptionsPanel() {
	const sampleCaptions = [
		"Companies tend to",
		"overuse AI as a",
		"buzzword for selling",
		"their smartphones,",
		"smart TVs or even",
		"smart fridges.",
		"They do this in order",
		"to make people think",
		"that the technology in",
		"their product is more",
		"advanced than",
	];

	return (
		<div className="flex-1 p-6">
			<div className="mb-6 flex justify-between">
				<Button variant="outline" size="sm">
					<RefreshCw className="mr-2 h-4 w-4" />
					Refresh
				</Button>
				<Button variant="outline" size="sm">
					<Download className="mr-2 h-4 w-4" />
					Export
				</Button>
			</div>

			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-medium">Generated Subtitles</h3>
					<span className="text-sm text-muted-foreground">36 lines</span>
				</div>
				<div className="space-y-2 rounded-lg border p-4">
					{sampleCaptions.map((caption, index) => (
						<div key={index} className="rounded-md p-2 text-sm hover:bg-muted">
							{caption}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
