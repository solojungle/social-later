"use client";

import { Compact } from "@uiw/react-color";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { FontPicker } from "./font-picker";
import { Slider } from "@/components/ui/slider";

export function FontStyles() {
	const [textFormat, setTextFormat] = useState<"none" | "lower" | "upper">(
		"none",
	);
	return (
		<>
			<FontPicker />
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
			<div className="space-y-2">
				<label className="text-sm font-medium">Font Size</label>
				<div className="flex items-center gap-4">
					<span className="w-12 text-sm text-muted-foreground">12px</span>
					<Slider
						min={12}
						max={72}
						onChange={(value) => {
							console.log(value);
						}}
					/>
					<span className="w-12 text-sm text-muted-foreground">64px</span>
				</div>
			</div>

			<Compact color="#68ccca" />
		</>
	);
}
