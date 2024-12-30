"use client";

import { Download, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CaptionsPanel() {
	const [captions, setCaptions] = useState([
		{ startTime: "00:02", endTime: "00:04", text: "Companies tend to" },
		{ startTime: "00:04", endTime: "00:06", text: "overuse AI as a" },
		{
			startTime: "00:06",
			endTime: "00:08",
			text: "buzzword for selling",
		},
		{ startTime: "00:08", endTime: "00:10", text: "their smartphones," },
		{ startTime: "00:10", endTime: "00:12", text: "smart TVs or even" },
		{ startTime: "00:12", endTime: "00:14", text: "smart fridges." },
		{
			startTime: "00:14",
			endTime: "00:16",
			text: "They do this in order",
		},
		{
			startTime: "00:16",
			endTime: "00:18",
			text: "to make people think",
		},
		{
			startTime: "00:18",
			endTime: "00:20",
			text: "that the technology in",
		},
		{
			startTime: "00:20",
			endTime: "00:22",
			text: "their product is more",
		},
		{ startTime: "00:22", endTime: "00:24", text: "advanced than" },
	]);

	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const handleCaptionEdit = (index: number, newText: string) => {
		const newCaptions = [...captions];
		newCaptions[index] = { ...newCaptions[index], text: newText };
		setCaptions(newCaptions);
	};

	const handleCaptionDelete = (index: number) => {
		const newCaptions = captions.filter((_, i) => i !== index);
		setCaptions(newCaptions);
		if (editingIndex === index) {
			setEditingIndex(null);
		}
	};

	return (
		<div className="flex-1">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h3 className="font-medium">Generated Subtitles</h3>
					<span className="text-sm text-muted-foreground">
						{captions.length} lines
					</span>
				</div>
				<div className="space-y-2 rounded-lg border p-4">
					{captions.map((caption, index) => (
						<div
							key={`caption-${caption.startTime}`}
							className="group flex items-center rounded-md p-2 text-sm hover:bg-muted"
						>
							<div
								className="flex flex-1 items-center"
								onClick={() => setEditingIndex(index)}
							>
								<span className="min-w-24 text-xs text-muted-foreground">
									{caption.startTime} - {caption.endTime}
								</span>
								{editingIndex === index ? (
									<input
										type="text"
										value={caption.text}
										onChange={(e) => handleCaptionEdit(index, e.target.value)}
										onBlur={() => setEditingIndex(null)}
										autoFocus
										className="flex-1 bg-transparent outline-none"
									/>
								) : (
									<span className="max-w-[200px]">{caption.text}</span>
								)}
							</div>
							<button
								onClick={() => handleCaptionDelete(index)}
								className="invisible ml-2 text-muted-foreground hover:text-destructive group-hover:visible"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
