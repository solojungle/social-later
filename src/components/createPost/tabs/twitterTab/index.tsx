"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileType } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Loader2, TypeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SheetClose } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicPostFormSchema } from "@/schemas/posts-schema";
import { api } from "@/trpc/react";

import { MediaFormField } from "../../mediaFormField";
import { DatePickerFormField } from "../../schedulePost/datePicker";
import { StatusFormField } from "../../statusFormField";

const RESTRICTIONS = {
	maxFiles: 4,
	maxSize: 5 * 1024 * 1024,
	maxSizeInMB: "5MB",
	accept: {
		"image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
	},
};

// Determine which type of file it is, image, video, gif
function determineFileType(file: File) {
	if (file.type.includes("video")) {
		return FileType.video;
	}
	if (file.type.includes("gif")) {
		return FileType.gif;
	}
	if (file.type.includes("image")) {
		return FileType.image;
	}

	throw new Error("File type not supported");
}

export function TwitterTab({
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
	const [loading, setLoading] = useState(false);

	const { mutateAsync: createFile } = api.file.create.useMutation();
	const { mutateAsync: fetchPresignedUrls } =
		api.aws.getStandardUploadPresignedUrl.useMutation();
	const tweet = api.socials.postTweet.useMutation({});

	const utils = api.useUtils();

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

	const FormSchema = DynamicPostFormSchema({
		size: RESTRICTIONS.maxSize,
		acceptedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
	});

	type FormSchemaValues = z.infer<typeof FormSchema>;

	const form = useForm<FormSchemaValues>({
		resolver: zodResolver(FormSchema),
	});

	async function uploadFile(file: File) {
		const filename = file.name.split(".").shift();
		const extension = file.name.split(".").pop();

		const presignedObject = await fetchPresignedUrls({
			fileExtension: extension || "",
		});

		await axios.put(presignedObject.signedUrl, file, {
			headers: {
				"Content-Type": file.type,
			},
		});

		// Determine which type of file it is, image, video, gif
		const mediaFileType = determineFileType(file);

		const mediaFile = await createFile({
			file: {
				name: filename || "",
				extension: extension || "",
				key: presignedObject.key,
				type: mediaFileType,
				size: file.size,
				mime: file.type,
			},
		});

		return mediaFile;
	}

	async function onSubmit(data: any) {
		setLoading(true);

		const scheduledDate = data.date;

		// If there is media then we need to convert it to a file and
		// upload it to aws. Then one the backend we will get the url
		// and upload it from aws to twitter.
		if (data.media && data.media.length > 0) {
			try {
				// Instead of uploading only one file, we need to upload all the files
				// and then send the mediaIds to the backend
				const mediaFiles = await Promise.all(
					data.media.map((file: File) => uploadFile(file)),
				);

				const { data: result } = await tweet.mutateAsync({
					profileId,
					content: data.content,
					mediaIds: mediaFiles.map((file) => file.id),
				});

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
				form.reset();
			}
		} else {
			const { data: result } = await tweet.mutateAsync({
				profileId,
				content: data.content,
			});

			// There is no media so we can just create the post
			createPost.mutate({
				title: "",
				content: data.content,
				status: "published",
				externalPostId: result.id,
				scheduledFor: scheduledDate,
				published: true,
				profileId,
				authorId: teamId,
			});
		}
	}

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Tabs defaultValue="status" className="w-full">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="status">
					<TypeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					Status
				</TabsTrigger>
				<TabsTrigger value="photo">
					<ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					Media
				</TabsTrigger>
			</TabsList>
			<TabsContent value="status" className="px-1 pt-8">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<StatusFormField form={form} />
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
			<TabsContent value="photo" className="px-1 pt-8">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<StatusFormField form={form} />
						<MediaFormField form={form} restrictions={RESTRICTIONS} />
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
