"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileType } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Loader2, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { PostFormSchema, PostFormSchemaValues } from "@/schemas/posts-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { EmojiPicker } from "../emojiPicker";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "../ui/sheet";
import { Textarea } from "../ui/textarea";

interface PostTweetProps {
	teamId: string;
	profileId: string;
	className?: string;
}

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
}: {
	teamId: string;
	profileId: string;
	className?: string;
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

		// If there is media then we need to convert it to a file and
		// upload it to aws. Then one the backend we will get the url
		// and upload it from aws to twitter.
		if (data.media && data.media.length > 0) {
			const imageFile = data.media[0] as File;
			const filename = imageFile.name.split(".").shift();
			const extension = imageFile.name.split(".").pop();

			try {
				const presignedObject = await fetchPresignedUrls();

				await axios.put(presignedObject.signedUrl, imageFile, {
					headers: {
						"Content-Type": imageFile.type,
					},
				});

				// Determine which type of file it is, image, video, gif
				const mediaFileType = determineFileType(imageFile);

				const mediaFile = await createFile({
					name: filename || "",
					extension: extension || "",
					key: presignedObject.key,
					type: mediaFileType,
					size: imageFile.size,
					mime: imageFile.type,
				});

				// Now that we've created the file, we can create the post
				createPost.mutate({
					title: "",
					content: data.content || "",
					fileId: mediaFile.id,
					status: "published",
					scheduledFor: new Date(),
					published: true,
					profileId,
					authorId: teamId,
				});

				// Now we tweet
				tweet.mutate({
					profileId,
					content: data.content,
					mediaId: mediaFile.id,
				});

				toast.success("Successfully created your post!", {});
			} finally {
				setLoading(false);
			}
		} else {
			// There is no media so we can just create the post
			createPost.mutate({
				title: "",
				content: data.content,
				status: "published",
				scheduledFor: new Date(),
				published: true,
				profileId,
				authorId: teamId,
			});

			// Now we tweet
			tweet.mutate({
				profileId,
				content: data.content,
			});
		}
	}

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className={className}>Post</Button>
			</SheetTrigger>
			<SheetContent className="w-[800px] !max-w-[80vw]" side="right">
				<TooltipProvider delayDuration={0}>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Post Text</FormLabel>
										<FormControl>
											<div className="shadow-sm">
												<div className="rounded-t-md border border-b-0 border-border p-1">
													<div className="flex justify-end">
														<Tooltip delayDuration={0}>
															<TooltipTrigger>
																<Button
																	type="button"
																	size="icon"
																	variant="ghost"
																>
																	<PaperclipIcon className="h-5 w-5 text-muted-foreground" />
																</Button>
															</TooltipTrigger>
															<TooltipContent>
																<span>Link shortener</span>
															</TooltipContent>
														</Tooltip>
														<Tooltip delayDuration={0}>
															<TooltipTrigger asChild>
																<Button
																	type="button"
																	size="icon"
																	variant="ghost"
																>
																	<ImageIcon className="h-5 w-5 text-muted-foreground" />
																</Button>
															</TooltipTrigger>
															<TooltipContent>
																<span>Add media</span>
															</TooltipContent>
														</Tooltip>
														<Tooltip delayDuration={0}>
															<TooltipTrigger>
																{/* TODO: Remove error button cannot appear as a descendant of button */}
																<EmojiPicker />
															</TooltipTrigger>
															<TooltipContent>
																<span>Emoji</span>
															</TooltipContent>
														</Tooltip>
													</div>
												</div>
												<Textarea
													className="!mt-0 rounded-t-none shadow-none"
													autoFocus
													{...field}
													placeholder="Write something, mention or add emoji..."
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="media"
								render={() => (
									<FormItem>
										<FormControl>
											<Input type="file" {...fileRef} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{/* {form.watch("file") && (
								<div className="relative flex items-center justify-center gap-3 p-4">
									<FileCheck2Icon className="h-4 w-4" />
									<p className="text-sm font-medium">
										{form.watch("file")?.name}
									</p>
								</div>
							)} */}
							{/* <ReorderableImageGallery
								images={[
									{
										id: "1",
										src: "https://via.placeholder.com/150",
										alt: "placeholder",
									},
									// {
									// 	id: "2",
									// 	src: "https://via.placeholder.com/150",
									// 	alt: "placeholder",
									// },
									// {
									// 	id: "3",
									// 	src: "https://via.placeholder.com/150",
									// 	alt: "placeholder",
									// },
								]}
							/> */}
							<div className="flex justify-end gap-2">
								<SheetClose asChild>
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
				</TooltipProvider>
			</SheetContent>
		</Sheet>
	);
}

function PostTweet({ teamId, className, profileId }: PostTweetProps) {
	return (
		<TweetForm className={className} teamId={teamId} profileId={profileId} />
	);
}

export function CreatePost({
	className,
	profileId,
}: {
	profileId: string;
	className?: string;
}) {
	const { id: teamId } = useSelectedTeamStore();

	if (!teamId || teamId === "" || !profileId || profileId === "") {
		return null;
	}

	return (
		<PostTweet className={className} teamId={teamId} profileId={profileId} />
	);
}
