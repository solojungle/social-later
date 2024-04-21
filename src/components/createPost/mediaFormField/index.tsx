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

type FileData = {
	id: string;
	file: File;
	type: "image" | "video";
};

type FileGalleryProps = {
	files: string[] | ArrayBuffer[] | null;
};

function FileGallery({ files }: FileGalleryProps) {
	if (files === null) {
		return (
			<div className="flex space-x-2">
				{new Array(4).fill(null).map(() => (
					<div
						key={Math.random()}
						className="h-32 w-32 rounded-md border bg-muted"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="grid w-fit grid-cols-4 gap-2">
			{files.map((fileData) => (
				<div key={Math.random()} className="group relative">
					<button
						type="button"
						className="absolute right-3 top-3 z-20 rounded-sm border border-border bg-background opacity-0 ring-offset-background transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
						// onClick={() => onRemoveFile(fileData.id)}
					>
						<Cross2Icon className="h-5 w-5" />
						<span className="sr-only">Close</span>
					</button>
					<div className="absolute z-10 h-32 w-32 rounded-md bg-black/30 opacity-0 group-hover:opacity-100" />
					<img
						key={Math.random()}
						src={fileData as string}
						alt={fileData as string}
						className="h-32 w-32 rounded-md border border-border object-cover"
					/>
				</div>
			))}
			{files.length < 4 && (
				<>
					{new Array(4 - files.length).fill(null).map(() => (
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
	fileRef: any;
	files: FileData[];
	onFilesChange: (files: FileData[]) => void;
};

export function MediaFormField({ form }: MediaFormFieldProps) {
	const [preview, setPreview] = React.useState<string | ArrayBuffer | null>("");

	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			const reader = new FileReader();
			try {
				if (acceptedFiles[0]) {
					reader.onload = () => setPreview(reader.result);
					reader.readAsDataURL(acceptedFiles[0]);
					form.setValue("image", acceptedFiles[0]);
					form.clearErrors("image");
				}
			} catch (error) {
				setPreview(null);
				form.resetField("image");
			}
		},
		[form],
	);

	const { getRootProps, getInputProps, isDragActive, fileRejections } =
		useDropzone({
			onDrop,
			maxFiles: 1,
			maxSize: 1000000,
			accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
		});

	return (
		<FormField
			control={form.control}
			name="image"
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
							<HoverCard openDelay={200}>
								<HoverCardTrigger className="absolute right-3 top-3 flex cursor-pointer items-center text-xs text-muted-foreground">
									Specifications
									<InfoIcon className="ml-1 h-4 w-4" />
								</HoverCardTrigger>
								<HoverCardContent
									className="text-xs"
									collisionPadding={{ right: 15 }}
								>
									<ul>
										<li>Max file size: 10MB</li>
										<li>Supported formats: jpg, png, gif</li>
									</ul>
								</HoverCardContent>
							</HoverCard>
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
							<p>Image must be less than 1MB and of type png, jpg, or jpeg</p>
						)}
					</FormMessage>
					<FileGallery files={preview ? [preview.toString()] : []} />
				</FormItem>
			)}
		/>
	);
}
