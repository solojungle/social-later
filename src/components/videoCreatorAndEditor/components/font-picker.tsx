"use client";

import { CheckIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function FontPicker() {
	const [selectedFont, setSelectedFont] = useState("Inter");

	const fonts = [
		{
			name: "Inter",
			className: "font-inter",
		},
		{
			name: "Roboto",
			className: "font-roboto",
		},
		{
			name: "Open Sans",
			className: "font-opensans",
		},
		{
			name: "Montserrat",
			className: "font-montserrat",
		},
		{
			name: "Lato",
			className: "font-lato",
		},
		{
			name: "Poppins",
			className: "font-poppins",
		},
	];

	const sampleText = "The quick brown fox jumps over the lazy dog";

	return (
		<div className="p-4">
			<h3 className="mb-2 font-medium">Caption Font</h3>
			<div className="grid grid-cols-3 gap-4">
				{fonts.map((font) => (
					<div
						key={font.name}
						className={cn(
							"relative cursor-pointer rounded-lg border p-4 hover:bg-accent",
							selectedFont === font.name && "border-primary bg-accent",
						)}
						onClick={() => setSelectedFont(font.name)}
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">{font.name}</p>
								{selectedFont === font.name && (
									<CheckIcon className="h-4 w-4 text-primary" />
								)}
							</div>
							<p
								className={cn("text-sm text-muted-foreground", font.className)}
							>
								{sampleText}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
