import { Search } from "lucide-react";

import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

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
		<div className="inline-flex max-h-[80vh] flex-col divide-y overflow-scroll pr-5">
			{posts.map((post) => (
				<div key={post.id} className="flex items-center py-2">
					<img
						alt="Post media"
						className="mr-4 h-16 w-16 rounded-xl"
						src="https://picsum.photos/200"
					/>
					<div className="flex w-full flex-col">
						<div className="mb-2 flex flex-col text-sm">
							<div className="flex justify-between gap-14">
								<p>{post.scheduledOn.toLocaleString()}</p>
								<p
									className={`text-xs font-semibold capitalize ${
										post.status === "approved"
											? "text-green-500"
											: post.status === "rejected"
											? "text-red-500"
											: "text-yellow-500"
									}`}
								>
									{post.status}
								</p>
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

export function PlannedPosts({ posts = [] }: PostsProps) {
	return (
		<div className="p-5">
			<div className="relative mb-4">
				<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input placeholder="Search posts..." className="pl-8" />
			</div>
			<Posts posts={posts} />
		</div>
	);
}
