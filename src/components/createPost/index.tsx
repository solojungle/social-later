"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileType } from "@prisma/client";
import axios from "axios";
import {
	GalleryThumbnailsIcon,
	ImageIcon,
	Loader2,
	TypeIcon,
	VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { PostFormSchema, PostFormSchemaValues } from "@/schemas/posts-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { MediaFormField } from "./mediaFormField";
import { DatePickerFormField } from "./schedulePost/datePicker";
import { StatusFormField } from "./statusFormField";

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

function TweetForm({
	teamId,
	profileId,
	className,
	scheduleDate,
}: {
	teamId: string;
	profileId: string;
	className?: string;
	scheduleDate: Date;
}) {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

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

	const form = useForm<PostFormSchemaValues>({
		resolver: zodResolver(PostFormSchema),
	});

	const fileRef = form.register("media", { required: true });

	async function onSubmit(data: any) {
		setLoading(true);

		const scheduledDate = data.date;

		// If there is media then we need to convert it to a file and
		// upload it to aws. Then one the backend we will get the url
		// and upload it from aws to twitter.
		if (data.media && data.media.length > 0) {
			const imageFile = data.media[0] as File;
			const filename = imageFile.name.split(".").shift();
			const extension = imageFile.name.split(".").pop();

			try {
				const presignedObject = await fetchPresignedUrls({
					fileExtension: extension || "",
				});

				await axios.put(presignedObject.signedUrl, imageFile, {
					headers: {
						"Content-Type": imageFile.type,
					},
				});

				// Determine which type of file it is, image, video, gif
				const mediaFileType = determineFileType(imageFile);

				const mediaFile = await createFile({
					file: {
						name: filename || "",
						extension: extension || "",
						key: presignedObject.key,
						type: mediaFileType,
						size: imageFile.size,
						mime: imageFile.type,
					},
				});

				const { data: result } = await tweet.mutateAsync({
					profileId,
					content: data.content,
					mediaId: mediaFile.id,
				});

				createPost.mutate({
					title: "",
					content: data.content || "",
					fileId: mediaFile.id,
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
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button className={className}>Post</Button>
			</SheetTrigger>
			<SheetContent
				className="w-[800px] !max-w-[80vw] !overflow-scroll pt-4"
				side="right"
			>
				<div className="mb-4">
					<SocialProfileSwitcher />
				</div>
				<TooltipProvider delayDuration={0}>
					<Tabs defaultValue="status" className="w-full">
						<TabsList className="grid w-full grid-cols-4">
							<TabsTrigger value="status">
								<TypeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
								Status
							</TabsTrigger>
							<TabsTrigger value="photo">
								<ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
								Photo
							</TabsTrigger>
							<TabsTrigger value="video">
								<VideoIcon className="mr-2 h-4 w-4 text-muted-foreground" />
								Video
							</TabsTrigger>
							<TabsTrigger value="carousel">
								<GalleryThumbnailsIcon className="mr-2 h-4 w-4 text-muted-foreground" />
								Carousel
							</TabsTrigger>
						</TabsList>
						<TabsContent value="status" className="px-1 pt-8">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
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
											{loading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Publish
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
						<TabsContent value="photo" className="px-1 pt-8">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<StatusFormField form={form} />
									<MediaFormField form={form} fileRef={fileRef} />
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
											{loading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Publish
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
						<TabsContent value="video" className="px-1 pt-8">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<StatusFormField form={form} />
									<MediaFormField form={form} fileRef={fileRef} />
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
											{loading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Publish
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
						<TabsContent value="carousel" className="px-1 pt-8">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-8"
								>
									<StatusFormField form={form} />
									<MediaFormField form={form} fileRef={fileRef} />
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
											{loading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Publish
										</Button>
									</div>
								</form>
							</Form>
						</TabsContent>
					</Tabs>
				</TooltipProvider>
			</SheetContent>
		</Sheet>
	);
}

export function CreatePost({
	className,
	scheduleDate,
	profileId,
}: {
	profileId: string;
	scheduleDate: Date;
	className?: string;
}) {
	const { id: teamId } = useSelectedTeamStore();

	if (!teamId || teamId === "" || !profileId || profileId === "") {
		return null;
	}

	return (
		<TweetForm
			className={className}
			teamId={teamId}
			profileId={profileId}
			scheduleDate={scheduleDate}
		/>
	);
}
