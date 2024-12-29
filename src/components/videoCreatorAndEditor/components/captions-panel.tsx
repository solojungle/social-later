"use client";

import { Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CaptionsPanel() {
	const sampleCaptions = [
		{ startTime: "00:00", endTime: "00:02", text: "Companies tend to" },
		{ startTime: "00:02", endTime: "00:04", text: "overuse AI as a" },
		{ startTime: "00:04", endTime: "00:06", text: "buzzword for selling" },
		{ startTime: "00:06", endTime: "00:08", text: "their smartphones," },
		{ startTime: "00:08", endTime: "00:10", text: "smart TVs or even" },
		{ startTime: "00:10", endTime: "00:12", text: "smart fridges." },
		{ startTime: "00:12", endTime: "00:14", text: "They do this in order" },
		{ startTime: "00:14", endTime: "00:16", text: "to make people think" },
		{ startTime: "00:16", endTime: "00:18", text: "that the technology in" },
		{ startTime: "00:18", endTime: "00:20", text: "their product is more" },
		{ startTime: "00:20", endTime: "00:22", text: "advanced than" },
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
						<div
							key={`caption-${caption.startTime}`}
							className="flex items-center rounded-md p-2 text-sm hover:bg-muted"
						>
							<span className="mr-4 text-xs text-muted-foreground">
								{caption.startTime} - {caption.endTime}
							</span>
							<span className="">{caption.text}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
