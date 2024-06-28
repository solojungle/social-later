"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { MediaFormField } from "@/components/createPost/mediaFormField";
import { CancelSubmitBar } from "@/components/createPost/tabs/cancelSubmitBar";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { YouTubeFormSchema } from "@/schemas/new-file-schema";

function Content() {
	const [loading, setLoading] = useState(false);

	function onSubmit(data: any) {
		console.log(data);
	}

	type FormSchemaValues = z.infer<typeof YouTubeFormSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			title: "",
			description: "",
			video: [],
			thumbnail: [],
		},
		resolver: zodResolver(YouTubeFormSchema),
	});

	const [fileProgress, setFileProgress] = useState<{
		[key: string]: { [key: number]: number };
	}>({});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="h-full space-y-8 "
			>
				<div className="h-full">
					<MediaFormField
						valueName="Media Files"
						form={form}
						fileProgress={fileProgress}
						restrictions={{
							maxFiles: 5,
							maxSize: 2 * 1024 * 1024,
							maxSizeInMB: "2MB",
							accept: {
								"image/*": [".jpeg", ".png", ".jpg"],
							},
						}}
						isLoading={loading}
					/>
				</div>
				<CancelSubmitBar loading={loading} form={form} action="Upload Media" />
			</form>
		</Form>
	);
}

export function AddAssets() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>
					<PlusIcon className="mr-1 h-5 w-5" />
					<Folder className="h-5 w-5 lg:invisible" />
					<span className="sr-only line-clamp-1 lg:not-sr-only">
						Add Assets
					</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0"
				side="right"
			>
				<Content />
			</SheetContent>
		</Sheet>
	);
}

// const { mutateAsync: createFile } = api.file.create.useMutation();
// const { mutateAsync: fetchMultipartPresignedUrls } =
// 	api.aws.getMultipartUploadPresignedUrl.useMutation();
// const { mutateAsync: completeMultipartUpload } =
// 	api.aws.completeMultipartUpload.useMutation();

// async function uploadFile(
// 	uploadedFile: FileUpload,
// 	onProgress: ({
// 		fileId,
// 		partNumber,
// 		progress,
// 	}: {
// 		fileId: string;
// 		partNumber: number;
// 		progress: number;
// 	}) => void = () => {},
// ) {
// 	const { file } = uploadedFile;

// 	const filename = file.name.split(".").shift();
// 	const extension = file.name.split(".").pop();

// 	const parts = splitFileIntoParts(file);

// 	const hashKey = crypto.randomUUID();
// 	const fileKey = `${hashKey}.${extension}`;

// 	const { uploadId, urls: signedUrls } = await fetchMultipartPresignedUrls({
// 		key: fileKey,
// 		filePartTotal: Object.keys(parts).length,
// 	});

// 	const uploadPromises: Promise<{
// 		PartNumber: number;
// 		ETag: string;
// 	}>[] = [];

// 	for (const { url, partNumber } of signedUrls) {
// 		const filePart = parts[partNumber] as File;

// 		uploadPromises.push(
// 			axios
// 				.put(url, filePart.slice(), {
// 					headers: {
// 						"Content-Type": file.type,
// 					},
// 					onUploadProgress: (progressEvent) => {
// 						const progress = Math.round(
// 							((progressEvent.loaded || 1) * 100) /
// 								(progressEvent.total || 1),
// 						);
// 						onProgress({ fileId: uploadedFile.id, partNumber, progress });
// 					},
// 				})
// 				.then((response) => {
// 					return {
// 						ETag: response.headers.etag as string,
// 						PartNumber: partNumber,
// 					};
// 				}),
// 		);
// 	}

// 	const uploadedParts = await Promise.all(uploadPromises);

// 	await completeMultipartUpload({
// 		uploadId,
// 		key: fileKey,
// 		parts: uploadedParts,
// 	});

// 	const mediaFile = await createFile({
// 		file: {
// 			name: filename || "",
// 			extension: extension || "",
// 			key: hashKey, // In order to be consistent with the backend, we need to remove the extension
// 			type: determineFileType(file),
// 			size: file.size,
// 			mime: file.type,
// 		},
// 	});

// 	return mediaFile;
// }

// const [fileProgress, setFileProgress] = useState<{
// 	[key: string]: { [key: number]: number };
// }>({});

// const [loading, setLoading] = useState(false);

// const { mutateAsync: uploadVideo } =
// 	api.socials.uploadYouTubeVideo.useMutation({});

// const utils = api.useUtils();

// const onProgress = ({
// 	fileId,
// 	partNumber,
// 	progress,
// }: {
// 	fileId: string;
// 	partNumber: number;
// 	progress: number;
// }) => {
// 	setFileProgress((prevProgress) => {
// 		const prevFileProgress = prevProgress[fileId] || {};
// 		return {
// 			...prevProgress,
// 			[fileId]: {
// 				...prevFileProgress,
// 				[partNumber]: progress,
// 			},
// 		};
// 	});
// };

// const createPost = api.post.create.useMutation({
// 	onSuccess() {
// 		toast.success("Successfully created your post!", {});
// 	},
// 	onSettled() {
// 		setLoading(false);
// 		setOpen(false);

// 		// Invalidate the query so we can refetch the data
// 		utils.post.getAll.invalidate();
// 	},
// });

// type FormSchemaValues = z.infer<typeof YouTubeFormSchema>;
// const form = useForm<FormSchemaValues>({
// 	defaultValues: {
// 		title: "",
// 		description: "",
// 		video: [],
// 		thumbnail: [],
// 		date: scheduleDate,
// 	},
// 	resolver: zodResolver(YouTubeFormSchema),
// });

// async function onSubmit(data: any) {
// 	setLoading(true);

// 	const scheduledDate = data.date;

// 	try {
// 		// Instead of uploading only one file, we need to upload all the files
// 		// and then send the mediaIds to the backend

// 		const filesToUpload = [...(data.thumbnail || []), ...data.video];
// 		const mediaFiles = await Promise.all(
// 			filesToUpload.map((file: FileUpload) => uploadFile(file, onProgress)),
// 		);

// 		const thumbnail = mediaFiles.find((file) => file.mime.includes("image"));
// 		const video = mediaFiles.find((file) => file.mime.includes("video"));

// 		const { data: result } = await uploadVideo({
// 			profileId,
// 			title: data.title,
// 			description: data.description,
// 			thumbnailUrl: thumbnail?.url ?? "",
// 			videoUrl: video?.url ?? "",
// 		});

// 		if (!result || !result.id) {
// 			throw new Error("Failed to upload video to YouTube");
// 		}

// 		createPost.mutate({
// 			title: data.title || "",
// 			content: data.content || "",
// 			fileIds: mediaFiles.map((file) => file.id),
// 			status: "published",
// 			externalPostId: result.id,
// 			scheduledFor: scheduledDate,
// 			published: true,
// 			profileId,
// 			authorId: teamId,
// 		});
// 	} finally {
// 		setLoading(false);
// 	}
// }
