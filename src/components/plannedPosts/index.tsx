import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

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

function Posts({ posts }: PostsProps) {
	if (!posts) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<p className="text-sm text-muted-foreground">Loading posts...</p>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<p className="text-sm text-muted-foreground">No posts found</p>
			</div>
		);
	}

	return (
		<div className="inline-flex h-[70vh] flex-col divide-y overflow-scroll pr-5">
			{posts.map((post) => (
				<div key={post.id} className="flex max-w-sm items-center py-2">
					<img
						alt="Post media"
						className="mr-4 h-20 w-20 rounded-xl"
						src="https://picsum.photos/200"
					/>
					<div className="flex w-full flex-col">
						<div className="mb-2 flex flex-col text-sm">
							<div className="flex justify-between gap-14">
								<p>{post.scheduledOn.toLocaleString()}</p>
								<p>Pending</p>
							</div>
							<p className="line-clamp-1 text-muted-foreground">{post.text}</p>
						</div>
						<div className="flex flex-wrap space-x-1">
							{post.tags.slice(0, 3).map((tag) => (
								<Badge key={tag}>{tag}</Badge>
							))}
							{post.tags.length > 3 && <Badge>+{post.tags.length - 3}</Badge>}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

export function PlannedPosts() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Planned posts</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="relative mb-4">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input placeholder="Search posts..." className="pl-8" />
				</div>
				<Posts posts={fakePosts} />
			</CardContent>
		</Card>
	);
}
