"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, TypeIcon } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useThreads } from "@/hooks/use-threads";
import { futureDateSchema } from "@/schemas/new-file-schema";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

import { CancelSubmitBar } from "../cancelSubmitBar";
import { ThreadsStatusFormFields } from "./formFields";

export const ThreadsSchema = z.object({
	status: z.string().min(1),
	date: futureDateSchema(),
});

export function ThreadsTab({
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
				content: data.status,
			});
			await createInternalPost(data, threadsPostId);
			onSuccessfulUpload(data);
		} catch (error) {
			onUploadError(error);
		} finally {
			onUploadComplete();
		}
	};

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Tabs defaultValue="text" className="w-full">
			<TabsList className="grid w-full grid-cols-2 gap-1">
				<TabsTrigger value="text">
					<TypeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					Status
				</TabsTrigger>
				<TabsTrigger value="video">
					<ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					Video
				</TabsTrigger>
			</TabsList>
			<TabsContent value="text" className="px-1 pt-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="flex h-[700px] flex-col justify-between"
					>
						<ThreadsStatusFormFields form={form} scheduleDate={scheduleDate} />
						<CancelSubmitBar loading={loading} form={form} />
					</form>
				</Form>
			</TabsContent>
			<TabsContent value="video" className="px-1 pt-8">
				{/* {!selected && (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-8"
						>
							<ThreadsFormFields
								form={form}
								fileProgress={fileProgress}
								loading={loading}
								scheduleDate={scheduleDate}
							/>
							<CancelSubmitBar loading={loading} form={form} />
						</form>
					</Form>
				)} */}
			</TabsContent>
		</Tabs>
	);
}
