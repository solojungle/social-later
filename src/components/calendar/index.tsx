"use client";

import { TwitterIcon } from "lucide-react";
import { useState } from "react";

interface PostsProps {
	posts: {
		id: string;
		media: string[];
		text: string;
		status: string;
		scheduledOn: Date;
		tags: string[];
	}[];
}

// This is the component that will be rendered on a day of the calendar
// It will show the posts that are scheduled for that day
function Posts({ posts = [] }: PostsProps) {
	if (posts.length === 0) {
		return null;
	}

	const renderedPosts = posts.map((p) => {
		const currentDay = new Date();
		const currentMonday = new Date(
			currentDay.setDate(currentDay.getDate() - currentDay.getDay()),
		);
		currentMonday.setHours(0);
		currentMonday.setMinutes(0);
		currentMonday.setSeconds(0);
		currentMonday.setMilliseconds(0);

		const isBeforeThisWeek = p.scheduledOn < currentMonday;

		return (
			<div
				key={p.id}
				className={`flex items-center rounded-sm bg-gray-200 p-2 text-xs ${
					isBeforeThisWeek ? "opacity-60" : ""
				}`}
			>
				<TwitterIcon className="h-4 w-4 shrink-0 text-blue-600" />
				<time className="ml-2 shrink-0">
					{p.scheduledOn.toLocaleTimeString([], {
						hour: "numeric",
						minute: "numeric",
					})}
				</time>
				<span className="ml-1 truncate text-xs text-muted-foreground">
					{p.text}
				</span>
				{
					{
						approved: (
							<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-green-500" />
						),
						pending: (
							<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
						),
						rejected: (
							<span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-red-500" />
						),
					}[p.status]
				}
			</div>
		);
	});

	return (
		<div
			className={`mx-px flex flex-col gap-px ${
				posts.length > 3 ? "overflow-y-scroll" : ""
			}`}
		>
			{renderedPosts}
		</div>
	);
}

export function PostsCalendar({ posts = [] }: PostsProps) {
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const startingDay = new Date(selectedYear, selectedMonth, 1).getDay();
	const previousMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
	const nextMonthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
	const today = new Date().getDate();

	// Add padding to the start and end of the month if the month doesn't start on a Monday
	// The padding should have a property of "disabled" so that it can be styled accordingly
	const days = [];

	// Find out which day this month starts, then add padding to the start of the month
	for (let i = 0; i < startingDay; i += 1) {
		days.push({
			day: previousMonthDays - i,
			disabled: true,
		});
	}

	// Add the days of the month
	for (let i = 1; i <= nextMonthDays; i += 1) {
		days.push({
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
			day: i,
			disabled: true,
			posts: [],
		});
	}

	// Add the posts to the days
	days.forEach((d) => {
		const filteredPosts = posts.filter((p) => {
			return (
				p.scheduledOn.getDate() === d.day &&
				p.scheduledOn.getMonth() === selectedMonth &&
				p.scheduledOn.getFullYear() === selectedYear
			);
		});

		d.posts = filteredPosts;
	});

	return (
		<div className="flex h-screen flex-col pb-6">
			<div className="flex flex-auto flex-col ">
				<div className="grid grid-cols-7 gap-px bg-gray-200 p-px pb-0 text-center text-xs font-semibold leading-6">
					<div className="bg-white py-2">
						S<span>un</span>
					</div>
					<div className="bg-white py-2">
						M<span>on</span>
					</div>
					<div className="bg-white py-2">
						T<span>ue</span>
					</div>
					<div className="bg-white py-2">
						W<span>ed</span>
					</div>
					<div className="bg-white py-2">
						T<span>hu</span>
					</div>
					<div className="bg-white py-2">
						F<span>ri</span>
					</div>
					<div className="bg-white py-2">
						S<span>at</span>
					</div>
				</div>
				<div className="flex flex-auto bg-gray-200 text-xs leading-6 text-gray-700">
					<div className="grid w-full grid-cols-7 grid-rows-5 gap-px border">
						{days.map((d) => {
							return (
								<div
									className={`flex flex-col ${
										d.disabled ? "bg-gray-50" : "bg-white"
									}`}
									key={d.day}
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
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
