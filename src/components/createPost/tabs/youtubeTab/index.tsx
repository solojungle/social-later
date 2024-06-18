"use client";

// eslint-disable-next-line simple-import-sort/imports
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YouTubeFormSchema } from "@/schemas/new-file-schema";

import { api } from "@/trpc/react";
import axios from "axios";
import { toast } from "sonner";
import { DescriptionFormField } from "../../descriptionFormField";
import { FileUpload, MediaFormField } from "../../mediaFormField";
import { DatePickerFormField } from "../../schedulePost/datePicker";
import { TitleFormField } from "../../titleFormField";
import { determineFileType, splitFileIntoParts } from "../../utils";

export function YouTubeTab({
	teamId,
	profileId,
	setOpen,
	scheduleDate,
}: {
	teamId: string;
	profileId: string;
	setOpen: (open: boolean) => void;
	scheduleDate: Date;
}) {
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchMultipartPresignedUrls } =
		api.aws.getMultipartUploadPresignedUrl.useMutation();
	const { mutateAsync: completeMultipartUpload } =
		api.aws.completeMultipartUpload.useMutation();

	async function uploadFile(
		uploadedFile: FileUpload,
		onProgress: ({
			fileId,
			partNumber,
			progress,
		}: {
			fileId: string;
			partNumber: number;
			progress: number;
		}) => void = () => {},
	) {
		const { file } = uploadedFile;

		const filename = file.name.split(".").shift();
		const extension = file.name.split(".").pop();

		const parts = splitFileIntoParts(file);

		const hashKey = crypto.randomUUID();
		const fileKey = `${hashKey}.${extension}`;

		const { uploadId, urls: signedUrls } = await fetchMultipartPresignedUrls({
			key: fileKey,
			filePartTotal: Object.keys(parts).length,
		});

		const uploadPromises: Promise<{
			PartNumber: number;
			ETag: string;
		}>[] = [];

		for (const { url, partNumber } of signedUrls) {
			const filePart = parts[partNumber] as File;

			uploadPromises.push(
				axios
					.put(url, filePart.slice(), {
						headers: {
							"Content-Type": file.type,
						},
						onUploadProgress: (progressEvent) => {
							const progress = Math.round(
								((progressEvent.loaded || 1) * 100) /
									(progressEvent.total || 1),
							);
							onProgress({ fileId: uploadedFile.id, partNumber, progress });
						},
					})
					.then((response) => {
						return {
							ETag: response.headers.etag as string,
							PartNumber: partNumber,
						};
					}),
			);
		}

		const uploadedParts = await Promise.all(uploadPromises);

		await completeMultipartUpload({
			uploadId,
			key: fileKey,
			parts: uploadedParts,
		});

		const mediaFile = await createFile({
			file: {
				name: filename || "",
				extension: extension || "",
				key: hashKey, // In order to be consistent with the backend, we need to remove the extension
				type: determineFileType(file),
				size: file.size,
				mime: file.type,
			},
		});

		return mediaFile;
	}

	const [fileProgress, setFileProgress] = useState<{
		[key: string]: { [key: number]: number };
	}>({});

	const [loading, setLoading] = useState(false);

	const { mutateAsync: uploadVideo } =
		api.socials.uploadYouTubeVideo.useMutation({});

	const utils = api.useUtils();

	const onProgress = ({
		fileId,
		partNumber,
		progress,
	}: {
		fileId: string;
		partNumber: number;
		progress: number;
	}) => {
		setFileProgress((prevProgress) => {
			const prevFileProgress = prevProgress[fileId] || {};
			return {
				...prevProgress,
				[fileId]: {
					...prevFileProgress,
					[partNumber]: progress,
				},
			};
		});
	};

	const createPost = api.post.create.useMutation({
		onSuccess() {
			toast.success("Successfully created your post!", {});
		},
		onSettled() {
			setLoading(false);
			setOpen(false);

			// Invalidate the query so we can refetch the data
			utils.post.getAll.invalidate();
		},
	});

	type FormSchemaValues = z.infer<typeof YouTubeFormSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			title: "",
			description: "",
			video: [],
			thumbnail: [],
			date: scheduleDate,
		},
		resolver: zodResolver(YouTubeFormSchema),
	});

	async function onSubmit(data: any) {
		setLoading(true);

		const scheduledDate = data.date;

		try {
			// Instead of uploading only one file, we need to upload all the files
			// and then send the mediaIds to the backend

			const filesToUpload = [...(data.thumbnail || []), ...data.video];
			const mediaFiles = await Promise.all(
				filesToUpload.map((file: FileUpload) => uploadFile(file, onProgress)),
			);

			const thumbnail = mediaFiles.find((file) => file.mime.includes("image"));
			const video = mediaFiles.find((file) => file.mime.includes("video"));

			const { data: result } = await uploadVideo({
				profileId,
				title: data.title,
				description: data.description,
				thumbnailUrl: thumbnail?.url ?? "",
				videoUrl: video?.url ?? "",
			});

			if (!result || !result.id) {
				throw new Error("Failed to upload video to YouTube");
			}

			createPost.mutate({
				title: "",
				content: data.content || "",
				fileIds: mediaFiles.map((file) => file.id),
				status: "published",
				externalPostId: result.id,
				scheduledFor: scheduledDate,
				published: true,
				profileId,
				authorId: teamId,
			});
		} finally {
			setLoading(false);
		}
	}

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Tabs defaultValue="video" className="w-full">
			<TabsList className="grid w-full grid-cols-1">
				<TabsTrigger value="video">
					<ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					Video
				</TabsTrigger>
			</TabsList>
			<TabsContent value="video" className="px-1 pt-8">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<TitleFormField form={form} />
						<DescriptionFormField form={form} valueName="description" />
						{/* Video file upload */}
						<MediaFormField
							valueName="video"
							form={form}
							fileProgress={fileProgress}
							restrictions={{
								maxFiles: 1,
								maxSize: 262144 * 1024 * 1024,
								maxSizeInMB: "256GB",
								accept: {
									"video/*": [".webp", ".mov", ".mp4"],
								},
							}}
							isLoading={loading}
						/>
						{/* Thumbnails upload */}
						<MediaFormField
							valueName="thumbnail"
							form={form}
							fileProgress={fileProgress}
							restrictions={{
								maxFiles: 1,
								maxSize: 2 * 1024 * 1024,
								maxSizeInMB: "2MB",
								accept: {
									"image/*": [".jpeg", ".png", ".jpg"],
								},
							}}
							isLoading={loading}
						/>
						<DatePickerFormField form={form} defaultDate={scheduleDate} />
						<div className="flex justify-end gap-2">
							<SheetClose
								asChild
								onClick={() => {
									form.reset();
								}}
							>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</SheetClose>
							<Button type="submit" disabled={loading}>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Publish
							</Button>
						</div>
					</form>
				</Form>
			</TabsContent>
		</Tabs>
	);
}
