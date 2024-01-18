"use client";

import { useState } from "react";

const fakePosts = [
	{
		id: "1",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023"],
	},
	{
		id: "2",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a super long test post that should wrap around and stuff and also have a lot of tags, and also be super duper long",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023"],
	},
	{
		id: "3",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023"],
	},
	{
		id: "4",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023"],
	},
	{
		id: "5",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
	{
		id: "6",
		media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
		text: "This is a test post",
		status: "approved",
		scheduledOn: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
		tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
	},
];

interface PostsProps {
	posts: {
		id: string;
		media: string[];
		text: string;
		status: "approved" | "rejected" | "pending";
		scheduledOn: Date;
		tags: string[];
	}[];
}

export function PostsCalendar({ posts = [] }: PostsProps) {
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	const startingDay = new Date(selectedYear, selectedMonth, 1).getDay();
	const previousMonthDays = new Date(selectedYear, selectedMonth, 0).getDate();
	const nextMonthDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();

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
		});
	}

	// Add padding to the end of the month if the month doesn't end on a Sunday
	// The padding should have a property of "disabled" so that it can be styled accordingly
	const daysToAdd = 7 - (days.length % 7);
	for (let i = 1; i <= daysToAdd; i += 1) {
		days.push({
			day: i,
			disabled: true,
		});
	}

	return (
		<div>
			<div className="flex flex-col">
				<div className="flex flex-auto flex-col">
					<div className="grid grid-cols-7 gap-px bg-gray-200 p-px pb-0 text-center text-xs font-semibold leading-6">
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
						<div className="bg-white py-2">
							S<span>un</span>
						</div>
					</div>
					<div className="flex flex-auto bg-gray-200 text-xs leading-6 text-gray-700">
						<div className="grid min-h-[70vh] w-full grid-cols-7 grid-rows-5 gap-px border">
							{days.map((d) => {
								return (
									<div
										className={`p-2 ${d.disabled ? "bg-gray-50" : "bg-white"}`}
										key={d.day}
									>
										<time className="pl-2 text-xs font-light text-muted-foreground">
											{d.day}
										</time>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

// return (
// 	<div className="grid grid-cols-7">
// 		{selectedDays.map((d) => {
// 			return (
// 				<div
// 					className="grid h-auto w-full grow border-collapse grid-cols-7 grid-rows-5 border border-red-500"
// 					key={d.day}
// 				>
// 					<div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
// 						<span className="text-xs font-light">{d.day}</span>
// 					</div>
// 				</div>
// 			);
// 		})}
// 	</div>
// );
