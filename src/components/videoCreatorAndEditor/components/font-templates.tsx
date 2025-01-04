/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

"use client";

import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { useEditor } from "../context/editor-context";

export function FontTemplates() {
	const { globalStyles, updateGlobalStyles } = useEditor();

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
		<div className="">
			<h3 className="mb-2 font-medium">Caption Font</h3>
			<div className="grid grid-cols-3 gap-1">
				{fonts.map((font) => (
					<div
						key={font.name}
						className={cn(
							"relative cursor-pointer rounded-lg border p-4 hover:bg-accent",
							globalStyles.fontFamily === font.name &&
								"border-primary bg-accent",
						)}
						onClick={() => updateGlobalStyles({ fontFamily: font.name })}
					>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">{font.name}</p>
								{globalStyles.fontFamily === font.name && (
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
