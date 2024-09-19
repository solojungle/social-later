"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";
import { TitleFormField } from "@/components/createPost/titleFormField";
import { formatSizeBytes } from "@/components/mediaPage/allAssets";
import { Form } from "@/components/ui/form";
import { useYouTubeUpload } from "@/hooks/use-youtube";
import { cn } from "@/lib/utils";
import { BaseYoutubeSchema } from "@/schemas/new-file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

import { CancelSubmitBar } from "../../cancelSubmitBar";

export function WithSelectedForm({
	teamId,
	profileId,
	setOpen,
	currentDate,
	selected,
}: {
	teamId: string;
	profileId: string;
	setOpen: (open: boolean) => void;
	currentDate: Date;
	selected?: any[];
}) {
	const [loading, setLoading] = useState(false);
	const { id: userId } = useUserStore();
	const utils = api.useUtils();
	const posthog = usePostHog();

	const { uploadVideo, createPost } = useYouTubeUpload();

	const FormSchema = BaseYoutubeSchema.omit({
		video: true,
		thumbnail: true,
	});

	type FormSchemaValues = z.infer<typeof FormSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			title: "",
			description: "",
			date: currentDate,
		},
		resolver: zodResolver(FormSchema),
	});

	const uploadVideoToYouTube = async (
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
		await createPost({
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

	const onSuccessfulUpload = (data: FormSchemaValues) => {
		toast.success("Successfully created your post!");
		posthog.capture("youtube_upload", {
			distinctId: userId,
			attachmentIncluded: true,
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

		if (!selected || selected.length === 0) {
			toast.error("No video selected");
			setLoading(false);
			return;
		}

		try {
			const videoId = await uploadVideoToYouTube(data, selected[0].url);
			await createYouTubePost(data, videoId, selected);
			onSuccessfulUpload(data);
		} catch (error) {
			onUploadError(error);
		} finally {
			onUploadComplete();
		}
	};

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<>
			{selected && selected.length > 0 && (
				<div className="mb-4 grid grid-cols-3 gap-1">
					{selected.map((file) => {
						return (
							<div
								key={file.id}
								className={cn(
									"group relative flex flex-col rounded-md border border-border",
									selected.includes(file.id) &&
										"ring-offset-px ring-2 ring-primary",
								)}
							>
								<div className="relative group-hover:cursor-pointer">
									<img
										src={file.thumbnail}
										alt={file.name}
										className="aspect-video w-full grow rounded-t-md object-cover"
									/>
								</div>
								<div className="flex h-14 items-center rounded-b-md border-t border-border bg-muted p-2 group-hover:cursor-pointer">
									<div className="w-full">
										<p
											className="mb-px truncate text-sm font-medium"
											title={`${file.name}.${file.extension}`}
										>
											{file.name}.{file.extension}
										</p>
										<div className="text-xs uppercase text-muted-foreground">
											{file.mime} - {formatSizeBytes(file.size)}
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
					<TitleFormField form={form} maxCharCount={100} />
					<DescriptionFormField
						form={form}
						valueName="description"
						maxCharCount={5000}
					/>
					<DatePickerFormField form={form} defaultDate={currentDate} />
					<CancelSubmitBar loading={loading} form={form} />
				</form>
			</Form>
		</>
	);
}
