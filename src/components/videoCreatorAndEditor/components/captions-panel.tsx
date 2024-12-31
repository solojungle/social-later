"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useEditor } from "../context/editor-context";

export function CaptionsPanel() {
	const {
		captions,
		addCaption,
		updateCaption,
		deleteCaption,
		selectCaption,
		selectedCaptionId,
	} = useEditor();
	const [editingId, setEditingId] = useState<string | null>(null);

	const handleCaptionEdit = (id: string, newText: string) => {
		updateCaption(id, { text: newText });
	};

	return (
		<div className="flex-1">
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<h3 className="font-medium">Captions</h3>
					<Button onClick={addCaption} variant="outline" size="sm">
						Add Caption
					</Button>
				</div>
				<div className="space-y-2 rounded-lg border p-4">
					<span className="self-end text-sm text-muted-foreground">
						{captions.length} captions
					</span>
					{captions.length === 0 && (
						<p className="text-xs text-muted-foreground">
							Add captions to your video by clicking the "Add Caption" button.
						</p>
					)}
					{captions.map((caption) => (
						<div
							key={caption.id}
							className={`group flex items-center rounded-md p-2 text-sm hover:bg-muted ${
								selectedCaptionId === caption.id ? "bg-muted" : ""
							}`}
							onClick={() => selectCaption(caption.id)}
						>
							<div className="flex flex-1 items-center">
								<span className="min-w-24 text-xs text-muted-foreground">
									{caption.startTime} - {caption.endTime}
								</span>
								{editingId === caption.id ? (
									<input
										type="text"
										value={caption.text}
										onChange={(e) =>
											handleCaptionEdit(caption.id, e.target.value)
										}
										onBlur={() => setEditingId(null)}
										className="flex-1 bg-transparent outline-none"
									/>
								) : (
									<span
										className="max-w-[200px] cursor-pointer"
										onClick={() => setEditingId(caption.id)}
									>
										{caption.text}
									</span>
								)}
							</div>
							<button
								onClick={(e) => {
									e.stopPropagation();
									deleteCaption(caption.id);
								}}
								className="invisible ml-2 text-muted-foreground hover:text-destructive group-hover:visible"
								aria-label="Delete caption"
								type="button"
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
