/* eslint-disable react/no-array-index-key */
import { Cross2Icon } from "@radix-ui/react-icons";
import { InfoIcon, UploadCloudIcon } from "lucide-react";
import React from "react";
import { FileRejection, useDropzone } from "react-dropzone";

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
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export type FileUpload = {
	id: string;
	file: File;
	preview: (string | ArrayBuffer)[];
	progress: number;
};

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

/**
 * grid-cols cannot be dynamic, so we need to return all possible values as a string
 * @param numberOfFiles - Number of files to display
 * @returns
 */
function returnNumberOfColumns(numberOfFiles: number) {
	switch (numberOfFiles) {
		case 1:
			return "grid-cols-1";
		case 2:
			return "grid-cols-2";
		case 3:
			return "grid-cols-3";
		case 4:
			return "grid-cols-4";
		case 5:
			return "grid-cols-5";
		case 6:
			return "grid-cols-6";
		case 7:
			return "grid-cols-7";
		case 8:
			return "grid-cols-8";
		case 9:
			return "grid-cols-9";
		case 10:
			return "grid-cols-10";
		default:
			return "grid-cols-1";
	}
}

type FileGalleryProps = {
	files: FileUpload[] | null;
	onRemoveFile: (index: string) => void;
	restrictions: {
		maxFiles: number;
		maxSize: number;
		maxSizeInMB: string;
		accept: Record<string, string[]>;
	};
	isLoading: boolean;
	fileProgress: { [key: string]: { [key: number]: number } };
};

function FileGallery({
	files,
	onRemoveFile,
	fileProgress,
	restrictions,
	isLoading,
}: FileGalleryProps) {
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
		<div
			className={cn(
				"grid w-fit gap-2",
				returnNumberOfColumns(restrictions.maxFiles),
			)}
		>
			{files.map((file) => (
				<div key={file.id} className="group relative">
					<button
						type="button"
						className="absolute right-3 top-3 z-20 rounded-sm border border-border bg-background opacity-0 ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
						onClick={() => onRemoveFile(file.id)}
					>
						<Cross2Icon className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</button>
					<div className="absolute z-10 h-32 w-32 rounded-md bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

					{file.preview.length === 0 ? (
						<div className="flex h-32 w-32 flex-col items-center justify-center rounded-md border border-border">
							<span className="flex w-32 justify-center overflow-hidden text-ellipsis px-1 text-sm">
								{file.file.name}
							</span>
							<span className="line-clamp-1 flex w-32 justify-center overflow-hidden text-ellipsis px-1 text-xs text-muted-foreground">
								{file.file.size} bytes
							</span>
						</div>
					) : (
						<img
							key={file.id}
							src={file.preview as unknown as string}
							alt="Uploaded file"
							className="h-32 w-32 rounded-md border border-border object-cover"
						/>
					)}

					{isLoading && (
						<Progress
							className="absolute bottom-0 w-full"
							value={Object.values(fileProgress[file.id] ?? {}).reduce(
								(acc, val) => acc + val,
								0,
							)}
						/>
					)}
				</div>
			))}
			{files.length < restrictions.maxFiles &&
				new Array(restrictions.maxFiles - files.length)
					.fill(null)
					.map(() => (
						<div
							key={Math.random()}
							className="h-32 w-32 rounded-md border bg-muted transition-colors duration-300"
						/>
					))}
		</div>
	);
}

type MediaFormFieldProps = {
	form: any;
	fileProgress: { [key: string]: { [key: number]: number } };
	restrictions: {
		maxFiles: number;
		maxSize: number;
		maxSizeInMB: string;
		accept: Record<string, string[]>;
	};
	isLoading: boolean;
};

export function MediaFormField({
	form,
	restrictions,
	fileProgress,
	isLoading,
}: MediaFormFieldProps) {
	const onDropAccepted = React.useCallback(
		(acceptedFiles: File[]) => {
			// Check if we have more than the max number of files
			if (form.getValues("media") > restrictions.maxFiles - 1) {
				form.setError("media", {
					type: "manual",
					message: `You can only upload ${restrictions.maxFiles} images`,
				});
				return;
			}

			acceptedFiles.forEach((file) => {
				const reader = new FileReader();
				reader.onload = () => {
					// If the file is a video dont create a preview
					if (file.type.includes("video")) {
						const updatedFiles = [
							...(form.getValues("media") || []),
							{
								id: Math.floor(Math.random() * 1000000).toString(),
								file,
								preview: [],
								progress: 0,
							},
						];

						form.setValue("media", updatedFiles);
						return;
					}

					const updatedFiles = [
						...(form.getValues("media") || []),
						{
							id: Math.floor(Math.random() * 1000000).toString(),
							file,
							preview: [reader.result as string | ArrayBuffer],
							progress: 0,
						},
					];

					form.setValue("media", updatedFiles);
				};
				reader.readAsDataURL(file);
			});

			form.clearErrors("media");
		},
		[form, restrictions.maxFiles],
	);

	const onDropRejected = React.useCallback(
		(rejections: FileRejection[]) => {
			form.setError("media", {
				type: "manual",
				message: rejections.length > 0 ? rejections[0]?.errors[0]?.message : "",
			});
		},
		[form],
	);

	const handleRemoveFile = (id: string) => {
		const updatedFiles = (form.getValues("media") || []).filter(
			(file: FileUpload) => file.id !== id,
		);

		form.setValue("media", updatedFiles);
	};

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDropAccepted,
			onDropRejected,
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
					<FormMessage />
					<FileGallery
						files={form.getValues("media") || []}
						onRemoveFile={handleRemoveFile}
						restrictions={restrictions}
						isLoading={isLoading}
						fileProgress={fileProgress}
					/>
				</FormItem>
			)}
		/>
	);
}
