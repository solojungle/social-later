"use client";

import { Compact } from "@uiw/react-color";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import { useEditor } from "../context/editor-context";
import { FontPicker } from "./font-picker";

export function FontStyles() {
	const { selectedCaptionId, updateCaption } = useEditor();
	const [textFormat, setTextFormat] = useState<
		"none" | "lowercase" | "uppercase"
	>("none");
	const [textShadow, setTextShadow] = useState<
		"none" | "small" | "medium" | "large"
	>("none");
	const [fontSize, setFontSize] = useState<number>(24);
	const [fontColor, setFontColor] = useState<string>("#FFFFFF");

	const handleFontSizeChange = (value: number[]) => {
		if (!selectedCaptionId) return;
		setFontSize(value[0]);
		updateCaption(selectedCaptionId, { style: { fontSize: value[0] } });
	};

	const handleColorChange = (color: string) => {
		if (!selectedCaptionId) return;
		setFontColor(color);
		updateCaption(selectedCaptionId, { style: { color } });
	};

	const handleTextFormatChange = (
		format: "none" | "lowercase" | "uppercase",
	) => {
		if (!selectedCaptionId) return;
		setTextFormat(format);
		// Note: text transform is handled in the caption rendering
		updateCaption(selectedCaptionId, { style: { textTransform: format } });
	};

	const handleShadowChange = (
		shadow: "none" | "small" | "medium" | "large",
	) => {
		if (!selectedCaptionId) return;
		setTextShadow(shadow);
		updateCaption(selectedCaptionId, { style: { shadow } });
	};

	return (
		<div className="space-y-6">
			<FontPicker />

			<div className="space-y-2">
				<label className="text-sm font-medium">Font Size</label>
				<div className="flex items-center gap-4">
					<span className="w-12 text-sm text-muted-foreground">
						{fontSize}px
					</span>
					<Slider
						min={12}
						max={72}
						step={1}
						value={[fontSize]}
						onValueChange={handleFontSizeChange}
						disabled={!selectedCaptionId}
					/>
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Font Color</label>
				<Compact
					color={fontColor}
					onChange={(color) => handleColorChange(color.hex)}
					disabled={!selectedCaptionId}
				/>
			</div>
			<div className="w-full space-y-2">
				<label className="text-sm font-medium">Text Format</label>
				<div className="flex w-full gap-2">
					<Button
						className="flex-1"
						variant={textFormat === "none" ? "default" : "outline"}
						onClick={() => handleTextFormatChange("none")}
					>
						None
					</Button>
					<Button
						className="flex-1"
						variant={textFormat === "lowercase" ? "default" : "outline"}
						onClick={() => handleTextFormatChange("lowercase")}
					>
						Lower
					</Button>
					<Button
						className="flex-1"
						variant={textFormat === "uppercase" ? "default" : "outline"}
						onClick={() => handleTextFormatChange("uppercase")}
					>
						Upper
					</Button>
				</div>
			</div>

			<div className="space-y-2">
				<label className="text-sm font-medium">Shadow</label>
				<div className="flex gap-2">
					{["none", "small", "medium", "large"].map((size) => (
						<Button
							key={size}
							className="flex-1"
							variant={textShadow === size ? "default" : "outline"}
							onClick={() =>
								handleShadowChange(
									size as "none" | "small" | "medium" | "large",
								)
							}
							// disabled={!selectedCaptionId}
						>
							{size === "none" ? "None" : size.charAt(0).toUpperCase()}
						</Button>
					))}
				</div>
			</div>
		</div>
	);
}
