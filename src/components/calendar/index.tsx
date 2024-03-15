"use client";

import { VideoIcon } from "lucide-react";
import { useState } from "react";

import { PostsSchemaValues } from "@/schemas/posts-schema";

import { CreatePost } from "../createPost";

interface PostsProps {
	profileId: string;
	posts: any | undefined;
}

function StyledPost() {
	return (
		<div className="relative">
			<div className="flex flex-col">
				<div className="absolute right-2 top-2 rounded-sm bg-secondary p-1">
					<VideoIcon className="h-4 w-4 text-secondary-foreground" />
				</div>
				<img
					className="aspect-video rounded-sm object-cover"
					src="https://images.unsplash.com/photo-1554629947-334ff61d85dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&h=1280&q=80"
					alt="A beautiful sunset"
				/>
			</div>
			<div className="absolute bottom-0 flex w-full items-center rounded-b  bg-primary/50 p-2 text-xs text-primary-foreground">
				<span className="line-clamp-1">10:00 AM</span>
				<span className="mx-2">•</span>
				<span className="truncate">A beautiful sunset...</span>
				<span className="mx-2">•</span>
				<span>Approved</span>
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

	const renderedPosts = StyledPost();

	// const renderedPosts = posts.map((p) => {
	// 	const currentDay = new Date();
	// 	const currentMonday = new Date(
	// 		currentDay.setDate(currentDay.getDate() - currentDay.getDay()),
	// 	);
	// 	currentMonday.setHours(0);
	// 	currentMonday.setMinutes(0);
	// 	currentMonday.setSeconds(0);
	// 	currentMonday.setMilliseconds(0);

	// 	const isBeforeThisWeek = p.scheduledFor < currentMonday;

	// 	// If the post has an attachment, render the attachment
	// 	if (p.url) {
	// 		return (
	// 			<div key={p.id} className="relative h-36">
	// 				<div className="relative flex flex-col">
	// 					{p.type === "video" ? (
	// 						<div className="absolute right-2 top-2 rounded-sm bg-gray-200 p-1">
	// 							<VideoIcon className="h-4 w-4 text-gray-600" />
	// 						</div>
	// 					) : (
	// 						<div className="absolute right-2 top-2 rounded-sm bg-gray-200 p-1">
	// 							<ImageIcon className="h-4 w-4 text-gray-600" />
	// 						</div>
	// 					)}
	// 					<img
	// 						className="rounded-sm object-cover"
	// 						src={p.url}
	// 						alt={p.content}
	// 					/>
	// 				</div>
	// 				<div className="absolute bottom-0 flex w-full items-center rounded-b bg-gray-200 p-2 text-xs">
	// 					{/* <span>{p.createdAt}</span> */}
	// 					<span className="mx-2">•</span>
	// 					lololol
	// 					{/* <span className="truncate">{p.content.slice(0, 20)}...</span> */}
	// 					<span className="mx-2">•</span>
	// 					<span>{p.status}</span>
	// 				</div>
	// 			</div>
	// 		);
	// 	}

	// 	return (
	// 		<div
	// 			key={p.id}
	// 			className={`flex items-center rounded-sm bg-gray-200 p-2 text-xs ${
	// 				isBeforeThisWeek ? "opacity-60" : ""
	// 			}`}
	// 		>
	// 			<TwitterIcon className="h-4 w-4 shrink-0 text-blue-600" />
	// 			<time className="ml-2 shrink-0">
	// 				{p.scheduledFor.toLocaleTimeString([], {
	// 					hour: "numeric",
	// 					minute: "numeric",
	// 				})}
	// 			</time>
	// 			<span className="ml-1 truncate text-xs text-muted-foreground">
	// 				{p.content}
	// 			</span>
	// 			{
	// 				{
	// 					approved: (
	// 						<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-green-500" />
	// 					),
	// 					pending: (
	// 						<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
	// 					),
	// 					rejected: (
	// 						<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-red-500" />
	// 					),
	// 				}[p.status]
	// 			}
	// 		</div>
	// 	);
	// });

	return (
		// <div
		// 	className={`mx-px flex flex-col gap-px ${
		// 		posts.length > 3 ? "overflow-y-scroll" : ""
		// 	}`}
		// >
		<div>{renderedPosts}</div>
	);
}

export function PostsCalendar({ posts = [], profileId }: PostsProps) {
	const [selectedMonth] = useState(new Date().getMonth());
	const [selectedYear] = useState(new Date().getFullYear());

	const startingDay = new Date(selectedYear, selectedMonth, 1).getDay();
	const previousMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
	const nextMonthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
	const today = new Date().getDate();

	// Add padding to the start and end of the month if the month doesn't start on a Monday
	// The padding should have a property of "disabled" so that it can be styled accordingly
	const days = [] as {
		id: string;
		day: number;
		disabled: boolean;
		isToday?: boolean;
		posts: PostsSchemaValues[];
	}[];

	// Find out which day this month starts, then add padding to the start of the month
	for (let i = 0; i < startingDay; i += 1) {
		days.push({
			id: Math.random().toString(),
			day: previousMonthDays - i,
			disabled: true,
			posts: [],
		});
	}

	// Add the days of the month
	for (let i = 1; i <= nextMonthDays; i += 1) {
		days.push({
			id: Math.random().toString(),
			day: i,
			disabled: false,
			isToday: i === today,
			posts: [],
		});
	}

	// Add padding to the end of the month if the month doesn't end on a Sunday
	// The padding should have a property of "disabled" so that it can be styled accordingly
	const daysToAdd = 7 - (days.length % 7);
	for (let i = 1; i <= daysToAdd; i += 1) {
		days.push({
			id: Math.random().toString(),
			day: i,
			disabled: true,
			posts: [],
		});
	}

	// Add the posts to the days
	days.forEach((d) => {
		const filteredPosts = posts.filter((p) => {
			return (
				p.scheduledFor.getDate() === d.day &&
				p.scheduledFor.getMonth() === selectedMonth &&
				p.scheduledFor.getFullYear() === selectedYear
			);
		});

		d.posts.push(...filteredPosts);
	});

	return (
		<div className="flex h-full flex-col">
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
									className={`group grid ${
										d.disabled ? "bg-secondary" : "bg-background"
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
									<CreatePost
										className="invisible mt-px w-full group-hover:visible"
										profileId={profileId}
									/>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
