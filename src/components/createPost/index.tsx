"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, PaperclipIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { Textarea } from "../ui/textarea";

interface PostTweetProps {
	teamId: string;
	className?: string;
}

const PostSchema = z.object({
	text: z.string().min(1),
	media: z.array(z.string()).optional(),
});

export type UserSchemaValues = z.infer<typeof PostSchema>;

function TweetForm({ className }: { className?: string }) {
	const [loading, setLoading] = useState(false);

	const tweet = api.socials.postTweet.useMutation({
		onSuccess() {
			toast.success("Successfully created your post!", {});
		},
	});

	const form = useForm<UserSchemaValues>({
		resolver: zodResolver(PostSchema),
	});

	function onSubmit(data: any) {
		tweet.mutate({
			...data,
			id: "clr6vvzz80008sofdtxfuz8me",
		});
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button className={className}>Post</Button>
			</DialogTrigger>
			<DialogContent>
				<TooltipProvider delayDuration={0}>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="text"
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="text">Post Text</FormLabel>
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
													id="text"
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
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor="media">Media Upload</FormLabel>
										<FormControl>
											<Input id="media" type="file" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex justify-end gap-2">
								<DialogClose asChild>
									<Button type="button" variant="outline">
										Cancel
									</Button>
								</DialogClose>
								<Button type="submit" disabled={loading}>
									{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
									Publish
								</Button>
							</div>
						</form>
					</Form>
				</TooltipProvider>
			</DialogContent>
		</Dialog>
	);
}

function PostTweet({ teamId, className }: PostTweetProps) {
	// const response = api.socials.getTwitterAccounts.useQuery({
	// 	id: teamId,
	// });

	// const { data: accounts } = response;

	// if (!accounts) {
	// 	return <div>Loading...</div>;
	// }

	return <TweetForm className={className} />;
}

export function CreatePost({ className }: { className?: string }) {
	const { id: teamId, type } = useSelectedTeamStore();

	if (type === "personal") {
		return null;
	}

	return <PostTweet className={className} teamId={teamId} />;
}
