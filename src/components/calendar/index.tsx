"use client";

import { FileType } from "@prisma/client";
import {
	ChevronLeft,
	ChevronRight,
	ImageIcon,
	Loader2,
	VideoIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
	PostsSchemaValues,
	PostWithAttachmentsSchemaValues,
} from "@/schemas/posts-schema";
import { api } from "@/trpc/react";

import { CreatePost } from "../createPost";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PostsProps {
	profileId: string;
	posts: PostWithAttachmentsSchemaValues[] | undefined;
}

async function deletePost({
	internalPostId,
	accountId,
	setOpen,
	deleteInternalPost,
	deleteTwitterPost,
}: {
	internalPostId: string;
	accountId: string;
	setOpen: (open: boolean) => void;
	deleteInternalPost: any;
	deleteTwitterPost: any;
}) {
	// First we delete the twitter post via the API
	deleteTwitterPost({ internalPostId, accountId });

	// Then we delete the post from the database
	deleteInternalPost({ internalPostId });

	// Then we close the modal and sheet
	setOpen(false);
}

function EditPostSheetContent({
	post,
	setOpen,
}: {
	post: PostWithAttachmentsSchemaValues;
	setOpen: (open: boolean) => void;
}) {
	const utils = api.useUtils();
	const { mutate: deleteTwitterPost } = api.socials.deleteTweet.useMutation({
		onSuccess: () => {
			toast.success("Successfully deleted your post.", {});
		},
	});
	const { mutate: deleteInternalPost } = api.post.delete.useMutation({
		onSuccess: () => {
			utils.post.getAll.invalidate();
		},
	});
	const [loading, setLoading] = useState(false);

	return (
		<SheetContent
			className="w-[600px] !max-w-[80vw] overflow-scroll"
			side="right"
		>
			<SheetHeader>
				<SheetTitle>Post View</SheetTitle>
			</SheetHeader>
			<div className="grid gap-4 py-4">
				{post.url && (
					<div>
						<Label>Media</Label>
						<img
							src={post.url}
							alt={post.title || "Post content"}
							className="aspect-video w-full rounded-lg object-scale-down"
						/>
					</div>
				)}
				{post.content && post.content.length > 0 && (
					<div>
						<Label>Content</Label>
						<Textarea
							defaultValue={post.content}
							placeholder="Write your post content here"
							className="h-40"
						/>
					</div>
				)}
			</div>
			<SheetFooter className="flex !justify-between">
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button type="button" variant="destructive">
							Delete Post
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								post and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								disabled={loading}
								onClick={() => {
									setLoading(true);
									deletePost({
										internalPostId: post.id,
										accountId: post.profileId,
										setOpen,
										deleteInternalPost,
										deleteTwitterPost,
									});
									setLoading(false);
								}}
							>
								{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>

				<div className="space-x-2">
					<SheetClose asChild>
						<Button type="submit" variant="secondary">
							Cancel
						</Button>
					</SheetClose>
					<SheetClose asChild>
						<Button type="submit">Save changes</Button>
					</SheetClose>
				</div>
			</SheetFooter>
		</SheetContent>
	);
}

function StyledStatus({ status }: { status: string }) {
	const condition = status.toLowerCase();

	if (condition === "published") {
		return (
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-green-500" />
				</TooltipTrigger>
				<TooltipContent>Published</TooltipContent>
			</Tooltip>
		);
	}
	if (condition === "pending") {
		return (
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
				</TooltipTrigger>
				<TooltipContent>Pending</TooltipContent>
			</Tooltip>
		);
	}
	if (condition === "rejected") {
		return (
			<Tooltip delayDuration={0}>
				<TooltipTrigger asChild>
					<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-red-500" />
				</TooltipTrigger>
				<TooltipContent>Rejected</TooltipContent>
			</Tooltip>
		);
	}

	return null;
}

function StyledMediaPost({
	post,
	open,
	setOpen,
}: {
	post: PostWithAttachmentsSchemaValues;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const [imageUrl, setImageUrl] = useState(post.thumbnail || post.url);

	if (!imageUrl || imageUrl === null) {
		return null;
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild className="cursor-pointer">
				<div className="relative m-px rounded-sm border border-border shadow-md">
					<div className="flex flex-col">
						<div className="absolute right-2 top-2 rounded-sm bg-secondary p-1">
							{post.attachment?.file.type === FileType.video ? (
								<VideoIcon className="h-4 w-4 text-secondary-foreground" />
							) : (
								<ImageIcon className="h-4 w-4 text-secondary-foreground" />
							)}
						</div>
						<img
							className="aspect-video rounded-sm object-cover"
							src={imageUrl}
							onError={() => {
								// If the thumbnail is not available, we will use the post content
								setImageUrl(post.url);
							}}
							alt={post.title || "Post content"}
						/>
					</div>
					<div className="absolute bottom-0 flex w-full flex-col rounded-b  bg-secondary p-2 text-xs text-secondary-foreground">
						<div className="flex items-center justify-between">
							<span className="font-medium">
								{post.scheduledFor.toLocaleString("en-US", {
									hour: "numeric",
									minute: "numeric",
									hour12: true,
								})}
							</span>

							{StyledStatus({ status: post.status })}
						</div>
						<span className="truncate">
							{post.content && post.content.slice(0, 50)}
						</span>
					</div>
				</div>
			</SheetTrigger>
			<EditPostSheetContent post={post} setOpen={setOpen} />
		</Sheet>
	);
}

// This is the component that will be rendered on a day of the calendar
// It will show the posts that are scheduled for that day
function Posts({ posts = [] }: { posts: PostsSchemaValues[] | undefined }) {
	const [open, setOpen] = useState(false);

	if (posts.length === 0) {
		return null;
	}

	const postToDisplay = posts[0];

	if (!postToDisplay) {
		return null;
	}

	if (postToDisplay.url) {
		return StyledMediaPost({ post: postToDisplay, open, setOpen });
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild className="cursor-pointer">
				<div className="m-px flex aspect-video flex-col rounded-sm border border-border bg-secondary p-2 text-xs text-secondary-foreground shadow-md">
					<div className="flex items-center justify-between">
						<span className="mb-1 font-medium">
							{postToDisplay.scheduledFor.toLocaleString("en-US", {
								hour: "numeric",
								minute: "numeric",
								hour12: true,
							})}
						</span>
						{StyledStatus({ status: postToDisplay.status })}
					</div>
					<span>
						{postToDisplay.content && postToDisplay.content.slice(0, 50)}
					</span>
				</div>
			</SheetTrigger>
			<EditPostSheetContent post={postToDisplay} setOpen={setOpen} />
		</Sheet>
	);
}

export function PostsCalendar({ posts = [], profileId }: PostsProps) {
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
	const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
	const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
	const daysInMonth = lastDayOfMonth.getDate();
	const firstDayOfWeek = firstDayOfMonth.getDay();
	const lastDayOfWeek = lastDayOfMonth.getDay();

	const days = [] as {
		id: string;
		day: number;
		postingDisabled: boolean;
		isNextOrPreviousMonth: boolean;
		isPreviousDay: boolean;
		isToday?: boolean;
		posts: PostsSchemaValues[];
	}[];

	// Add the previous month days
	const previousMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();

	for (let i = firstDayOfWeek - 1; i >= 0; i -= 1) {
		const day = previousMonthDays - i;
		days.push({
			id: `previous-${day}`,
			day,
			postingDisabled: true,
			isNextOrPreviousMonth: true,
			isPreviousDay: true,
			posts: [],
		});
	}

	// Add the current month days
	for (let i = 1; i <= daysInMonth; i += 1) {
		const date = new Date(selectedYear, selectedMonth, i);
		const isToday = date.toDateString() === new Date().toDateString();
		days.push({
			id: `current-${i}`,
			day: i,
			postingDisabled: false,
			isNextOrPreviousMonth: false,
			isPreviousDay: date <= new Date(),
			isToday,
			posts: posts.filter((p) => {
				const postDate = new Date(p.scheduledFor);
				return postDate.toDateString() === date.toDateString();
			}),
		});
	}

	// Add the next month days
	for (let i = 1; i <= 6 - lastDayOfWeek; i += 1) {
		days.push({
			id: `next-${i}`,
			day: i,
			postingDisabled: true,
			isPreviousDay: false,
			isNextOrPreviousMonth: true,
			posts: [],
		});
	}

	return (
		<div className="flex h-full flex-col">
			<div className="flex items-center space-x-4 rounded-t border border-b-0 p-2">
				<Button
					variant="ghost"
					onClick={() => {
						const newDate = new Date(selectedYear, selectedMonth - 1);
						setSelectedMonth(newDate.getMonth());
						setSelectedYear(newDate.getFullYear());
					}}
				>
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<span className="flex w-36 justify-center font-semibold">
					{new Date(selectedYear, selectedMonth).toLocaleString("default", {
						month: "long",
					})}
					, {selectedYear}
				</span>
				<Button
					variant="ghost"
					onClick={() => {
						const newDate = new Date(selectedYear, selectedMonth + 1);
						setSelectedMonth(newDate.getMonth());
						setSelectedYear(newDate.getFullYear());
					}}
				>
					<ChevronRight className="h-5 w-5" />
				</Button>
			</div>
			<div className="flex flex-auto flex-col pb-24">
				<div className="grid grid-cols-7 gap-px bg-border p-px pb-0 text-center text-xs font-semibold leading-6">
					<div className="bg-background py-2 text-foreground">
						S<span>un</span>
					</div>
					<div className="bg-background py-2 text-foreground">
						M<span>on</span>
					</div>
					<div className="bg-background py-2 text-foreground">
						T<span>ue</span>
					</div>
					<div className="bg-background py-2 text-foreground">
						W<span>ed</span>
					</div>
					<div className="bg-background py-2 text-foreground">
						T<span>hu</span>
					</div>
					<div className="bg-background py-2 text-foreground">
						F<span>ri</span>
					</div>
					<div className="bg-background py-2 text-foreground">
						S<span>at</span>
					</div>
				</div>
				<div className="flex flex-auto bg-border text-xs leading-6 text-foreground">
					<div className="grid w-full grid-cols-7 grid-rows-5 gap-px border">
						{days.map((d) => {
							return (
								<div
									className={`group grid bg-background ${
										d.isNextOrPreviousMonth && "opacity-60"
									}`}
									key={d.id}
								>
									<time
										className={`m-1 mb-4 flex h-5 w-5 items-center justify-center rounded-full  text-xs text-muted-foreground ${
											d.isToday
												? "bg-primary font-semibold text-primary-foreground"
												: "font-light"
										}`}
									>
										{d.day}
									</time>
									{d.posts && d.posts.length > 0 && <Posts posts={d.posts} />}
									{d.posts.length === 0 && (
										<div className="relative aspect-video" />
									)}
									{!d.postingDisabled && (!d.isPreviousDay || d.isToday) ? (
										<CreatePost
											className="invisible mt-px w-full group-hover:visible"
											profileId={profileId}
											scheduleDate={
												new Date(selectedYear, selectedMonth, d.day)
											}
										/>
									) : (
										<CreatePost
											className="invisible mt-px w-full"
											profileId={profileId}
											scheduleDate={
												new Date(selectedYear, selectedMonth, d.day)
											}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
