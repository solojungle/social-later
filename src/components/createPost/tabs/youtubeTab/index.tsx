"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { OnProgress, uploadFile } from "@/components/fileUpload";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileProgress, useFileUpload } from "@/hooks/use-file-upload";
import { useYouTubeUpload } from "@/hooks/use-youtube";
import { YouTubeFormSchema } from "@/schemas/new-file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

import { CancelSubmitBar } from "../cancelSubmitBar";
import { WithSelectedForm } from "./withSelectedForm";
import { YouTubeFormFields } from "./youtubeFormFields";

export function YouTubeTab({
	teamId,
	profileId,
	setOpen,
	scheduleDate,
	selected,
}: {
	teamId: string;
	profileId: string;
	setOpen: (open: boolean) => void;
	scheduleDate: Date;
	selected?: any[];
}) {
	const { id: userId } = useUserStore();
	const posthog = usePostHog();
	const [loading, setLoading] = useState(false);
	const [fileProgress, setFileProgress] = useState<FileProgress>({});
	const utils = api.useUtils();

	const { createFile, fetchMultipartPresignedUrls, completeMultipartUpload } =
		useFileUpload();
	const { uploadVideo, changeThumbnail, createPost, updateThumbnail } =
		useYouTubeUpload();

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

	const uploadMediaFiles = async (data: FormSchemaValues) => {
		const filesToUpload = [...(data.thumbnail || []), ...data.video];
		return Promise.all(
			filesToUpload.map((file) =>
				uploadFile({
					uploadedFile: file,
					onProgress: OnProgress,
					fetchMultipartPresignedUrls,
					completeMultipartUpload,
					setFileProgress,
					createFile,
				}),
			),
		);
	};

	const separateMediaFiles = (mediaFiles: any[]) => ({
		thumbnailFile: mediaFiles.find((file) => file.mime.includes("image")),
		videoFile: mediaFiles.find((file) => file.mime.includes("video")),
	});

	const uploadYouTubeVideo = async (
		data: FormSchemaValues,
		videoUrl: string,
	) => {
		const { data: result } = await uploadVideo({
			profileId,
			title: data.title,
			description: data.description,
			videoUrl,
			scheduledTime: new Date(data.date).toISOString(),
		});

		if (!result || !result.id) {
			throw new Error("Failed to upload video to YouTube");
		}

		return result.id;
	};

	const createYouTubePost = async (
		data: FormSchemaValues,
		externalPostId: string,
		mediaFiles: any[],
	) => {
		return createPost({
			title: data.title || "",
			content: data.description || "",
			fileIds: mediaFiles.map((file) => file.id),
			socialType: "youtube",
			externalPostId,
			scheduledFor: data.date || undefined,
			profileId,
			authorId: teamId,
		});
	};

	const handleThumbnailUpdate = async (
		thumbnailFile: any,
		videoId: string,
		postId: string,
	) => {
		if (thumbnailFile) {
			await changeThumbnail({
				profileId,
				videoId,
				thumbnailUrl: thumbnailFile.url,
			});

			await updateThumbnail({
				postId,
				thumbnailUrl: thumbnailFile.thumbnail,
			});
		}
	};

	const onSuccessfulUpload = (data: FormSchemaValues) => {
		toast.success("Successfully created your post!");
		posthog.capture("youtube_upload", {
			distinctId: userId,
			attachmentIncluded: false,
			scheduled: !!data.date,
		});
	};

	const onUploadError = (error: any) => {
		console.error("Upload error:", error);
		toast.error(
			"An error occurred while trying to upload the video. Please try again.",
		);
	};

	const onUploadComplete = () => {
		setLoading(false);
		setOpen(false);
		utils.post.invalidate();
	};

	const handleSubmit = async (data: FormSchemaValues) => {
		setLoading(true);
		try {
			const mediaFiles = await uploadMediaFiles(data);
			const { thumbnailFile, videoFile } = separateMediaFiles(mediaFiles);
			const videoId = await uploadYouTubeVideo(data, videoFile);
			const post = await createYouTubePost(data, videoId, mediaFiles);
			await handleThumbnailUpdate(thumbnailFile, videoId, post.id);

			onSuccessfulUpload(data);
		} catch (error) {
			onUploadError(error);
		} finally {
			onUploadComplete();
		}
	};

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
				{selected && selected.length > 0 && (
					<WithSelectedForm
						teamId={teamId}
						profileId={profileId}
						setOpen={setOpen}
						currentDate={scheduleDate}
						selected={selected}
					/>
				)}

				{!selected && (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-8"
						>
							<YouTubeFormFields
								form={form}
								fileProgress={fileProgress}
								loading={loading}
								scheduleDate={scheduleDate}
							/>
							<CancelSubmitBar loading={loading} form={form} />
						</form>
					</Form>
				)}
			</TabsContent>
		</Tabs>
	);
}
