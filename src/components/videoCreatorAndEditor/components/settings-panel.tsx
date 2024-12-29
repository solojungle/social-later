"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function SettingsPanel() {
	const [textFormat, setTextFormat] = useState<"none" | "lower" | "upper">(
		"none",
	);
	const [removePunctuation, setRemovePunctuation] = useState(false);

	return (
		<div className="w-[400px] border-r p-6">
			<h2 className="mb-2 text-xl font-semibold">Advanced Settings</h2>
			<p className="mb-6 text-sm text-muted-foreground">
				Customize subtitle generation parameters
			</p>

			<div className="space-y-6">
				<div className="space-y-2">
					<label className="text-sm font-medium">Model</label>
					<Select defaultValue="whisper-base">
						<SelectTrigger>
							<SelectValue placeholder="Select model" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="whisper-base">Whisper Base</SelectItem>
							<SelectItem value="whisper-small">Whisper Small</SelectItem>
							<SelectItem value="whisper-medium">Whisper Medium</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<label className="text-sm font-medium">Translate to English</label>
						<p className="text-xs text-muted-foreground">
							Any Language to English
						</p>
					</div>
					<Switch />
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium">Text Formatting</label>
					<div className="flex gap-2">
						<Button
							variant={textFormat === "none" ? "default" : "outline"}
							size="sm"
							onClick={() => setTextFormat("none")}
							className="flex-1"
						>
							None
						</Button>
						<Button
							variant={textFormat === "lower" ? "default" : "outline"}
							size="sm"
							onClick={() => setTextFormat("lower")}
							className="flex-1"
						>
							Lower
						</Button>
						<Button
							variant={textFormat === "upper" ? "default" : "outline"}
							size="sm"
							onClick={() => setTextFormat("upper")}
							className="flex-1"
						>
							Upper
						</Button>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<label className="text-sm font-medium">Remove Punctuation</label>
					<Switch
						checked={removePunctuation}
						onCheckedChange={setRemovePunctuation}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-medium">Max words</label>
						<Input type="number" defaultValue={6} />
					</div>
					<div className="space-y-2">
						<label className="text-sm font-medium">Max characters</label>
						<Input type="number" defaultValue={25} />
					</div>
				</div>
			</div>
		</div>
	);
}
