"use client";

import { FileType } from "@prisma/client";
import { ImageIcon, VideoIcon } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PostWithAttachmentsSchemaValues } from "@/schemas/posts-schema";

import { EditPostSheetContent } from "../editPostSheetContent";

interface PostsProps {
	posts: PostWithAttachmentsSchemaValues[];
	className: string;
}

function StyledStatus({ status }: { status: string }) {
	const condition = status.toLowerCase();

	const statusColors: { [key: string]: string } = {
		published: "text-green-600",
		pending: "text-yellow-600",
		rejected: "text-red-600",
	};

	return (
		<span className={`capitalize ${statusColors[condition]}`}>{status}</span>
	);
}

function UpcomingPostItem({
	post,
	open,
	setOpen,
}: {
	post: PostWithAttachmentsSchemaValues;
	open: boolean;
	setOpen: (open: boolean) => void;
}) {
	const postAttachment = post.attachment[0];
	const [imageUrl, setImageUrl] = useState(
		postAttachment?.thumbnail ?? postAttachment?.url,
	);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild className="cursor-pointer">
				<div className="flex items-center space-x-4 rounded-md border border-border p-2 shadow-sm">
					<div className="relative shrink-0">
						<img
							className="aspect-video h-16 rounded-sm object-cover"
							src={imageUrl ?? "images/videoPlaceholder.png"}
							onError={() => {
								setImageUrl(
									postAttachment?.file.type === FileType.video
										? "images/videoPlaceholder.png"
										: "",
								);
							}}
							alt={post.title || "Post content"}
						/>
						<div className="absolute right-0 top-0 rounded-bl-sm bg-secondary p-1">
							{postAttachment?.file.type === FileType.video ? (
								<VideoIcon className="h-3 w-3 text-secondary-foreground" />
							) : (
								<ImageIcon className="h-3 w-3 text-secondary-foreground" />
							)}
						</div>
					</div>
					<div className="min-w-0 grow">
						<div className="flex items-center justify-between text-xs text-secondary-foreground">
							<span className="font-medium">
								{new Date(post.scheduledFor).toLocaleDateString("en-US", {
									hour: "numeric",
									minute: "numeric",
									hour12: true,
									month: "long",
									day: "numeric",
								})}
							</span>
							<StyledStatus status={post.status} />
						</div>
						<p className="mt-1 truncate text-xs">
							{post.content && post.content.slice(0, 50)}
							{!post.content && "No description"}
						</p>
					</div>
				</div>
			</SheetTrigger>
			<EditPostSheetContent post={post} />
		</Sheet>
	);
}

export function PostsList({ posts = [], className }: PostsProps) {
	const [openPostId, setOpenPostId] = useState<string | null>(null);

	if (posts.length === 0) {
		return <p>No posts available</p>;
	}

	return (
		<div className={cn("flex w-full flex-col space-y-2", className)}>
			{posts.map((post) => (
				<UpcomingPostItem
					key={post.id}
					post={post}
					open={openPostId === post.id}
					setOpen={(open) => setOpenPostId(open ? post.id : null)}
				/>
			))}
		</div>
	);
}
