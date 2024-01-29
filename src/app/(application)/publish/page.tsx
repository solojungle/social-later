"use client";

import { PostsCalendar } from "@/components/calendar";
import { PlannedPosts } from "@/components/plannedPosts";
import { ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { useSelectedTeamStore } from "@/stores/selected-team";

export default function PublishPage() {
	function randomDateThisMonth() {
		const random = new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			Math.floor(Math.random() * 31) + 1,
		);

		return random;
	}

	const fakePosts = [
		{
			id: "1",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023"],
		},
		{
			id: "2",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a super long test post that should wrap around and stuff and also have a lot of tags, and also be super duper long",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023"],
		},
		{
			id: "3",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023"],
		},
		{
			id: "4",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023"],
		},
		{
			id: "5",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023"],
		},
		{
			id: "6",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "7",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "8",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "9",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post This is a test post This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "10",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "11",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "pending",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "12",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "13",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "14",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "15",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "pending",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "16",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "pending",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "17",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "18",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "approved",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "19",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "pending",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
		{
			id: "20",
			media: ["https://pbs.twimg.com/media/E1Q0qQqXoAEXX5-.jpg"],
			text: "This is a test post",
			status: "pending",
			scheduledOn: randomDateThisMonth(),
			tags: ["Blog", "Spring", "2023", "Pine Point", "It was you", "I know it"],
		},
	];

	const { type } = useSelectedTeamStore();

	if (type === "personal") {
		return (
			<ResizablePanel minSize={30}>
				<div className="flex h-full items-center justify-center">
					<h2>Please select or create or join a team to view the calendar.</h2>
				</div>
			</ResizablePanel>
		);
	}

	return (
		<>
			<ResizablePanel minSize={30}>
				<PlannedPosts posts={fakePosts} />
			</ResizablePanel>
			<ResizableHandle withHandle />
			<ResizablePanel minSize={30} className="p-5">
				<PostsCalendar posts={fakePosts} />
			</ResizablePanel>
		</>
	);
}
