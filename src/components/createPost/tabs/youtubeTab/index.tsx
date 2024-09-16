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
import { YouTubeFormSchema } from "@/schemas/new-file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

import { DescriptionFormField } from "../../descriptionFormField";
import { FileUpload, MediaFormField } from "../../mediaFormField";
import { DatePickerFormField } from "../../schedulePost/datePicker";
import { TitleFormField } from "../../titleFormField";
import { CancelSubmitBar } from "../cancelSubmitBar";
import { WithSelectedForm } from "./withSelectedForm";

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
	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchMultipartPresignedUrls } =
		api.aws.getMultipartUploadPresignedUrl.useMutation();
	const { mutateAsync: completeMultipartUpload } =
		api.aws.completeMultipartUpload.useMutation();
	const [fileProgress, setFileProgress] = useState<{
		[key: string]: { [key: number]: number };
	}>({});
	const { mutateAsync: uploadVideo } =
		api.socials.uploadYouTubeVideo.useMutation({});
	const { mutateAsync: changeThumbnail } =
		api.socials.changeVideoThumbnail.useMutation({});
	const utils = api.useUtils();
	const { mutateAsync: createPost } = api.post.create.useMutation({});
	const { mutateAsync: updateThumbnail } =
		api.post.updateThumbnail.useMutation();

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

		try {
			// Instead of uploading only one file, we need to upload all the files
			// and then send the mediaIds to the backend
			const filesToUpload = [...(data.thumbnail || []), ...data.video];
			const mediaFiles = await Promise.all(
				filesToUpload.map((file: FileUpload) =>
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

			const thumbnailFile = mediaFiles.find((file) =>
				file.mime.includes("image"),
			);
			const video = mediaFiles.find((file) => file.mime.includes("video"));

			const { data: result } = await uploadVideo({
				profileId,
				title: data.title,
				description: data.description,
				videoUrl: video?.url ?? "",
				scheduledTime: new Date(data.date).toISOString(),
			});

			if (!result || !result.id) {
				throw new Error("Failed to upload video to YouTube");
			}

			const post = await createPost({
				title: data.title || "",
				content: data.description || "",
				fileIds: mediaFiles.map((file) => file.id),
				externalPostId: result.id,
				scheduledFor: data.date || undefined,
				profileId,
				authorId: teamId,
			});

			toast.success("Successfully created your post!");

			// Capture the event in PostHog
			posthog.capture("youtube_upload", {
				distinctId: userId,
				scheduled: !!data.date,
			});

			try {
				// Change the thumbnail if the user uploaded a new one
				if (thumbnailFile) {
					await changeThumbnail({
						profileId,
						videoId: result.id,
						// We want to upload the original thumbnail since YouTube will compress on their end
						thumbnailUrl: thumbnailFile.url,
					});

					await updateThumbnail({
						postId: post.id,
						// We want the optimized thumbnail for our platform
						thumbnailUrl: thumbnailFile.thumbnail,
					});
				}
			} catch (error) {
				toast.error(
					"An error occured while trying to change the thumbnail. Please try again.",
				);
			}
		} catch (error) {
			toast.error(
				"An error occured while trying to upload the video. Please try again.",
			);
		} finally {
			setLoading(false);
			setOpen(false);

			// Invalidate the query so we can refetch the data
			utils.post.invalidate();
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
							<CancelSubmitBar loading={loading} form={form} />
						</form>
					</Form>
				)}
			</TabsContent>
		</Tabs>
	);
}
