/* eslint-disable react/no-array-index-key */
import { Cross2Icon } from "@radix-ui/react-icons";
import { InfoIcon, UploadCloudIcon } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";

type HoverCardSectionProps = {
	restrictions: {
		maxFiles: number;
		maxSize: number;
		maxSizeInMB: string;
		accept: Record<string, string[]>;
	};
};

function HoverCardSection({ restrictions }: HoverCardSectionProps) {
	return (
		<HoverCard openDelay={200}>
			<HoverCardTrigger className="absolute right-3 top-3 flex cursor-pointer items-center text-xs text-muted-foreground">
				Specifications
				<InfoIcon className="ml-1 h-4 w-4" />
			</HoverCardTrigger>
			<HoverCardContent className="text-xs" collisionPadding={{ right: 15 }}>
				<ul>
					<li>Max file size: {restrictions.maxSizeInMB}</li>
					<li>
						Supported formats:{" "}
						{Object.keys(restrictions.accept).map(
							(key) => restrictions.accept[key]?.join(", ") ?? "",
						)}
					</li>
					<li>Max number of files: {restrictions.maxFiles}</li>
				</ul>
			</HoverCardContent>
		</HoverCard>
	);
}

type FileGalleryProps = {
	files: (string | ArrayBuffer)[] | null;
	onRemoveFile: (index: number) => void;
	restrictions: {
		maxFiles: number;
		maxSize: number;
		maxSizeInMB: string;
		accept: Record<string, string[]>;
	};
};

function FileGallery({ files, onRemoveFile, restrictions }: FileGalleryProps) {
	if (files === null) {
		return (
			<div className="flex space-x-2">
				{new Array(restrictions.maxFiles).fill(null).map(() => (
					<div
						key={Math.random()}
						className="h-32 w-32 rounded-md border bg-muted"
					/>
				))}
			</div>
		);
	}

	return (
		// eslint-disable-next-line tailwindcss/classnames-order, tailwindcss/no-custom-classname
		<div className={`grid w-fit grid-cols-${restrictions.maxFiles} gap-2`}>
			{files.map((fileData, index) => (
				<div key={index} className="group relative">
					<button
						type="button"
						className="absolute right-3 top-3 z-20 rounded-sm border border-border bg-background opacity-0 ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
						onClick={() => onRemoveFile(index)}
					>
						<Cross2Icon className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</button>
					<div className="absolute z-10 h-32 w-32 rounded-md bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
					<img
						key={index}
						src={fileData as unknown as string}
						alt="Uploaded file"
						className="h-32 w-32 rounded-md border border-border object-cover"
					/>
				</div>
			))}
			{files.length < restrictions.maxFiles && (
				<>
					{new Array(restrictions.maxFiles - files.length)
						.fill(null)
						.map(() => (
							<div
								key={Math.random()}
								className="h-32 w-32 rounded-md border bg-muted transition-colors duration-300"
							/>
						))}
				</>
			)}
		</div>
	);
}

type MediaFormFieldProps = {
	form: any;
	restrictions: {
		maxFiles: number;
		maxSize: number;
		maxSizeInMB: string;
		accept: Record<string, string[]>;
	};
};

export function MediaFormField({ form, restrictions }: MediaFormFieldProps) {
	const [previews, setPreviews] = React.useState<(string | ArrayBuffer)[]>([]);
	const [files, setFiles] = React.useState<File[] | null>(null);

	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			// Check if we have more than the max number of files
			if (previews.length > restrictions.maxFiles - 1) {
				form.setError("media", {
					type: "manual",
					message: `You can only upload ${restrictions.maxFiles} images`,
				});
				return;
			}

			acceptedFiles.forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					setPreviews((prev) => [
						...prev,
						reader.result as string | ArrayBuffer,
					]);
				};
				reader.readAsDataURL(file);
			});

			form.setValue("media", acceptedFiles);
			form.clearErrors("media");
			setFiles(acceptedFiles);
		},
		[form, previews.length, restrictions.maxFiles],
	);

	const handleRemoveFile = (index: number) => {
		const updatedPreviews = [...previews];
		updatedPreviews.splice(index, 1);

		const updatedFiles = [...(files ?? [])];
		updatedFiles.splice(index, 1);

		setPreviews(updatedPreviews);
		setFiles(updatedFiles);

		form.setValue("media", updatedFiles);
	};

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop,
			maxFiles: restrictions.maxFiles,
			maxSize: restrictions.maxSize,
			accept: restrictions.accept,
		});

	return (
		<FormField
			control={form.control}
			name="media"
			render={() => (
				<FormItem>
					<FormLabel
						className={`${fileRejections.length !== 0 && "text-destructive"}`}
					>
						Media
						<span
							className={
								form.formState.errors.image || fileRejections.length !== 0
									? "text-destructive"
									: "text-muted-foreground"
							}
						/>
					</FormLabel>
					<FormControl>
						<div
							{...getRootProps()}
							className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed py-8 ${
								isDragActive ? "border-blue-600" : "border-primary"
							}`}
						>
							<HoverCardSection restrictions={restrictions} />
							<div
								className={`flex flex-col items-center justify-center ${
									isDragActive ? "opacity-50" : ""
								}`}
							>
								<Input {...getInputProps()} type="file" />
								<div className="mb-3 flex items-center justify-center rounded-full border border-border bg-primary-foreground p-2">
									<UploadCloudIcon className="h-8 w-8 text-primary" />
								</div>
								<span className="text-sm text-primary">
									Click to upload, or drag and drop
								</span>
							</div>
						</div>
					</FormControl>
					<FormMessage>
						{fileRejections.length !== 0 && (
							<p>
								Image must be less than {restrictions.maxSizeInMB} and of type
								png, jpg, or jpeg
							</p>
						)}
					</FormMessage>
					<FileGallery
						files={previews}
						onRemoveFile={handleRemoveFile}
						restrictions={restrictions}
					/>
				</FormItem>
			)}
		/>
	);
}
