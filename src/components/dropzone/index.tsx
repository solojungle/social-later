import React, { ChangeEvent, useRef } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DropzoneProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "onChange"
	> {
	classNameWrapper?: string;
	className?: string;
	dropMessage: string;
	handleOnDrop: (acceptedFiles: FileList | null) => void;
}

export function handleOnDrop(acceptedFiles: FileList | null) {
	if (acceptedFiles && acceptedFiles.length > 0) {
		const allowedTypes = [
			{ name: "csv", types: ["text/csv"] },
			{
				name: "excel",
				types: [
					"application/vnd.ms-excel",
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				],
			},
		];
		const fileType = allowedTypes.find((allowedType) =>
			allowedType.types.find((type) => type === acceptedFiles[0]?.type),
		);
		if (!fileType) {
			form.setValue("file", null);
			form.setError("file", {
				message: "File type is not valid",
				type: "typeError",
			});
		} else {
			form.setValue("file", acceptedFiles[0]);
			form.clearErrors("file");
		}
	} else {
		form.setValue("file", null);
		form.setError("file", {
			message: "File is required",
			type: "typeError",
		});
	}
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
	(
		{ className, classNameWrapper, dropMessage, handleOnDrop, ...props },
		ref,
	) => {
		const inputRef = useRef<HTMLInputElement | null>(null);
		// Function to handle drag over event
		const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			handleOnDrop(null);
		};

		// Function to handle drop event
		const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			const { files } = e.dataTransfer;
			if (inputRef.current) {
				inputRef.current.files = files;
				handleOnDrop(files);
			}
		};

		// Function to simulate a click on the file input element
		const handleButtonClick = () => {
			if (inputRef.current) {
				inputRef.current.click();
			}
		};
		return (
			<Card
				ref={ref}
				className={cn(
					`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
					classNameWrapper,
				)}
			>
				<CardContent
					className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={handleButtonClick}
				>
					<div className="flex items-center justify-center text-muted-foreground">
						<span className="font-medium">{dropMessage}</span>
						<Input
							{...props}
							value={undefined}
							ref={inputRef}
							type="file"
							className={cn("hidden", className)}
							onChange={(e: ChangeEvent<HTMLInputElement>) =>
								handleOnDrop(e.target.files)
							}
						/>
					</div>
				</CardContent>
			</Card>
		);
	},
);

Dropzone.displayName = "Dropzone";

export default Dropzone;
