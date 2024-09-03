"use client";

// eslint-disable-next-line simple-import-sort/imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DescriptionFormField } from "@/components/createPost/descriptionFormField";
import { DatePickerFormField } from "@/components/createPost/schedulePost/datePicker";
import { TitleFormField } from "@/components/createPost/titleFormField";
import { formatSizeBytes } from "@/components/mediaPage/allAssets";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { BaseYoutubeSchema } from "@/schemas/new-file-schema";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";
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

	const { mutateAsync: uploadVideo } =
		api.socials.uploadYouTubeVideo.useMutation({});

	const FormSchema = BaseYoutubeSchema.omit({
		video: true,
		thumbnail: true,
	});

	const utils = api.useUtils();

	type FormSchemaValues = z.infer<typeof FormSchema>;
	const form = useForm<FormSchemaValues>({
		defaultValues: {
			title: "",
			description: "",
			date: currentDate,
		},
		resolver: zodResolver(FormSchema),
	});

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

	async function onSubmit(data: any) {
		setLoading(true);

		const scheduledDate = data.date;

		if (!selected) {
			toast.error("No video selected");
			setLoading(false);
			return;
		}

		const selectedVideoUrl = selected[0].url;

		try {
			const { data: result } = await uploadVideo({
				profileId,
				title: data.title,
				description: data.description,
				videoUrl: selectedVideoUrl,
			});

			if (!result || !result.id) {
				throw new Error("Failed to upload video to YouTube");
			}

			createPost.mutate({
				title: data.title || "",
				content: data.content || "",
				fileIds: selected.map((file) => file.id),
				externalPostId: result.id,
				scheduledFor: scheduledDate,
				profileId,
				authorId: teamId,
			});
		} finally {
			setLoading(false);
		}
	}

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
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<TitleFormField form={form} />
					<DescriptionFormField form={form} valueName="description" />
					<DatePickerFormField form={form} defaultDate={currentDate} />
					<CancelSubmitBar loading={loading} form={form} />
				</form>
			</Form>
		</>
	);
}
