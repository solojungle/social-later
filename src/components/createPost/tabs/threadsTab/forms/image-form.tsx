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
import { SelectedPreview } from "../../selectedFiles";
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
	selected,
}: {
	userId: string;
	scheduleDate: any;
	profileId: string;
	teamId: string;
	setOpen: any;
	selected?: any[];
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

	const onSuccessfulUpload = (date: Date) => {
		toast.success("Successfully created your post!");
		posthog.capture("threads_post", {
			distinctId: userId,
			attachmentIncluded: false,
			scheduled: !!date,
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
			const threadsPostId = await createThreadsPost({
				profileId,
				mediaType: "IMAGE",
				media: mediaFiles[0],
				text: data.status,
			});
			await createInternalPost({
				data,
				externalPostId: threadsPostId,
				mediaFiles,
			});
			onSuccessfulUpload(data.date);
		} catch (error) {
			onUploadError(error);
		} finally {
			onUploadComplete();
		}
	};

	const SelectedThreadsSchema = z.object({
		status: z.string().optional(),
		date: futureDateSchema(),
	});
	type SelectedFormSchemaValues = z.infer<typeof SelectedThreadsSchema>;
	const selectedForm = useForm<SelectedFormSchemaValues>({
		defaultValues: {
			status: "",
			date: scheduleDate,
		},
		resolver: zodResolver(SelectedThreadsSchema),
	});

	const handleSubmitWithSelected = async (data: SelectedFormSchemaValues) => {
		setLoading(true);

		if (!selected || selected.length === 0) {
			toast.error("No files selected");
			setLoading(false);
			return;
		}

		try {
			const threadsPostId = await createThreadsPost({
				profileId,
				mediaType: "IMAGE",
				media: selected[0],
				text: data.status,
			});

			await createPost({
				title: "",
				content: data.status,
				fileIds: selected.map((file) => file.id),
				socialType: "threads",
				externalPostId: threadsPostId,
				scheduledFor: data.date || undefined,
				profileId,
				authorId: teamId,
			});

			onSuccessfulUpload(data.date);
		} catch (error) {
			onUploadError(error);
		} finally {
			onUploadComplete();
		}
	};

	return (
		<>
			{selected && (
				<>
					<SelectedPreview files={selected} />
					<Form {...selectedForm}>
						<form
							onSubmit={selectedForm.handleSubmit(handleSubmitWithSelected)}
							className="flex h-[700px] flex-col justify-between"
						>
							<ThreadsImageFormFields
								form={selectedForm}
								fileProgress={fileProgress}
								loading={loading}
								scheduleDate={scheduleDate}
								selected={selected}
							/>
							<CancelSubmitBar loading={loading} form={selectedForm} />
						</form>
					</Form>
				</>
			)}
			{!selected && (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex h-[700px] flex-col justify-between"
					>
						<ThreadsImageFormFields
							form={form}
							fileProgress={fileProgress}
							loading={loading}
							scheduleDate={scheduleDate}
							selected={selected}
						/>
						<CancelSubmitBar loading={loading} form={form} />
					</form>
				</Form>
			)}
		</>
	);
}
