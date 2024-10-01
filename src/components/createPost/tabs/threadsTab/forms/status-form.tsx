"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useThreads } from "@/hooks/use-threads";
import { futureDateSchema } from "@/schemas/new-file-schema";
import { api } from "@/trpc/react";

import { CancelSubmitBar } from "../../cancelSubmitBar";
import { ThreadsStatusFormFields } from "../formFields";

export const ThreadsSchema = z.object({
	status: z.string().min(1),
	date: futureDateSchema(),
});

export function ThreadsStatusForm({
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
	const utils = api.useUtils();

	const { createThreadsPost, createPost } = useThreads();

	type FormSchemaValues = z.infer<typeof ThreadsSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			status: "",
			date: scheduleDate,
		},
		resolver: zodResolver(ThreadsSchema),
	});

	const createInternalPost = async (
		data: FormSchemaValues,
		externalPostId: string,
	) => {
		return createPost({
			title: "",
			content: data.status,
			socialType: "threads",
			externalPostId,
			scheduledFor: data.date || undefined,
			profileId,
			authorId: teamId,
		});
	};

	// const onSuccessfulUpload = (data: FormSchemaValues) => {
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
			const threadsPostId = await createThreadsPost({
				profileId,
				mediaType: "TEXT",
				text: data.status,
			});
			await createInternalPost(data, threadsPostId);
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
				<ThreadsStatusFormFields form={form} scheduleDate={scheduleDate} />
				<CancelSubmitBar loading={loading} form={form} />
			</form>
		</Form>
	);
}
