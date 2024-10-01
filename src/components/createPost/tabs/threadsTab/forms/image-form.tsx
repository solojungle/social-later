"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { OnProgress, uploadFile } from "@/components/fileUpload";
import { Form } from "@/components/ui/form";
import { FileProgress, useFileUpload } from "@/hooks/use-file-upload";
import { useThreads } from "@/hooks/use-threads";
import { fileSchema, futureDateSchema } from "@/schemas/new-file-schema";
import { api } from "@/trpc/react";

import { CancelSubmitBar } from "../../cancelSubmitBar";
import { ThreadsImageFormFields } from "../formFields";

export const ThreadsSchema = z.object({
	status: z.string().optional(),
	image: z
		.array(
			fileSchema(8 * 1024 * 1024, ["image/png", "image/jpeg", "image/jpg"]),
		)
		.min(1),
	date: futureDateSchema(),
});

export function ThreadsImageForm({
	userId,
	scheduleDate,
	profileId,
	teamId,
	setOpen,
}: {
	userId: string;
	scheduleDate: any;
	profileId: string;
	teamId: string;
	setOpen: any;
}) {
	const posthog = usePostHog();
	const [loading, setLoading] = useState(false);
	const [fileProgress, setFileProgress] = useState<FileProgress>({});
	const utils = api.useUtils();

	const { createFile, fetchMultipartPresignedUrls, completeMultipartUpload } =
		useFileUpload();
	const { createThreadsPost, createPost } = useThreads();

	type FormSchemaValues = z.infer<typeof ThreadsSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			status: "",
			image: [],
			date: scheduleDate,
		},
		resolver: zodResolver(ThreadsSchema),
	});

	const uploadMediaFiles = async (data: FormSchemaValues) => {
		const filesToUpload = [...(data.image || [])];
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

	const createInternalPost = async ({
		data,
		externalPostId,
		mediaFiles,
	}: {
		data: FormSchemaValues;
		externalPostId: string;
		mediaFiles: any[];
	}) => {
		return createPost({
			title: "",
			content: data.status,
			fileIds: mediaFiles.map((file) => file.id),
			socialType: "threads",
			externalPostId,
			scheduledFor: data.date || undefined,
			profileId,
			authorId: teamId,
		});
	};

	const onSuccessfulUpload = (data: FormSchemaValues) => {
		toast.success("Successfully created your post!");
		posthog.capture("threads_post", {
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
			const file = mediaFiles[0];
			const threadsPostId = await createThreadsPost({
				profileId,
				mediaType: "IMAGE",
				media: file,
				text: data.status,
			});
			await createInternalPost({
				data,
				externalPostId: threadsPostId,
				mediaFiles,
			});
			onSuccessfulUpload(data);
		} catch (error) {
			onUploadError(error);
		} finally {
			onUploadComplete();
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="flex h-[700px] flex-col justify-between"
			>
				<ThreadsImageFormFields form={form} scheduleDate={scheduleDate} />
				<CancelSubmitBar loading={loading} form={form} />
			</form>
		</Form>
	);
}
