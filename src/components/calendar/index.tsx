"use client";

import { ChevronLeft, ChevronRight, ImageIcon, VideoIcon } from "lucide-react";
import { useState } from "react";

import { PostsSchemaValues } from "@/schemas/posts-schema";

import { CreatePost } from "../createPost";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface PostsProps {
	profileId: string;
	posts: any | undefined;
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

function StyledMediaPost({ post }: { post: PostsSchemaValues }) {
	return (
		<div className="relative m-px rounded-sm border border-border shadow-md">
			<div className="flex flex-col">
				<div className="absolute right-2 top-2 rounded-sm bg-secondary p-1">
					{post.type === "video" ? (
						<VideoIcon className="h-4 w-4 text-secondary-foreground" />
					) : (
						<ImageIcon className="h-4 w-4 text-secondary-foreground" />
					)}
				</div>
				<img
					className="aspect-video rounded-sm object-cover"
					src={post.url}
					alt="post content"
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
	);
}

// This is the component that will be rendered on a day of the calendar
// It will show the posts that are scheduled for that day
function Posts({ posts = [] }: { posts: PostsSchemaValues[] | undefined }) {
	if (posts.length === 0) {
		return null;
	}

	const postToDisplay = posts[0];

	if (!postToDisplay) {
		return null;
	}

	if (postToDisplay.url) {
		return StyledMediaPost({ post: postToDisplay });
	}

	return (
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
			<span>{postToDisplay.content && postToDisplay.content.slice(0, 50)}</span>
		</div>
	);
}

export function PostsCalendar({ posts = [], profileId }: PostsProps) {
	const [selectedMonth] = useState(new Date().getMonth());
	const [selectedYear] = useState(new Date().getFullYear());
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
			<div className="flex items-center space-x-4 rounded-t border border-b-0 p-5">
				<Button className="sticky self-start" variant="ghost">
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<span className="font-semibold">
					{new Date(selectedYear, selectedMonth).toLocaleString("default", {
						month: "long",
					})}
					, {selectedYear}
				</span>
				<Button className="sticky self-start" variant="ghost">
					<ChevronRight className="h-5 w-5" />
				</Button>
			</div>
			<div className="flex flex-auto flex-col ">
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
										/>
									) : (
										<CreatePost
											className="invisible mt-px w-full"
											profileId={profileId}
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
