"use client";

import { FileType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SheetClose, SheetContent } from "@/components/ui/sheet";
import { Player } from "@/components/videoPlayer";
import { PostWithAttachmentsSchemaValues } from "@/schemas/posts-schema";

// Helper function to render attachments
const renderAttachment = (attachment: any) => {
	if (attachment.file.type === FileType.image) {
		return (
			<img
				key={attachment.url}
				src={attachment.url}
				alt={attachment.alt || "Post content"}
				className="aspect-video w-full rounded-lg object-scale-down"
			/>
		);
	}
	if (attachment.file.type === FileType.video) {
		return (
			<Player
				title=""
				video={attachment.url}
				poster=""
				posterAlt=""
				thumbnails=""
			/>
		);
	}
	return null;
};

// Helper function to render video statistics
const renderVideoStats = (post: any) => {
	const stats = {
		views: 0,
		estimatedRevenue: 0,
		likes: 0,
		comments: 0,
		viewsPerHour: 0,
	};

	return (
		<Card className="rounded-sm shadow-none">
			<CardContent className="grid grid-cols-5 gap-px p-4">
				<div>
					<Label className="text-xs">Views</Label>
					<p className="text-xl">{stats.views.toLocaleString()}</p>
				</div>
				<div>
					<Label className="text-xs">Likes</Label>
					<p className="text-xl">{stats.likes.toLocaleString()}</p>
				</div>
				<div>
					<Label className="text-xs">Comments</Label>
					<p className="text-xl">{stats.comments.toLocaleString()}</p>
				</div>
				<div>
					<Label className="text-xs">Est. Revenue</Label>
					<p className="text-xl">${stats.estimatedRevenue.toFixed(2)}</p>
				</div>
				<div>
					<Label className="text-xs">Views Per Hour</Label>
					<p className="text-xl">{stats.viewsPerHour.toFixed(1)}</p>
				</div>
			</CardContent>
		</Card>
	);
};

// Helper function to render video metadata
const renderVideoMetadata = (post: any) => {
	const date = new Date(post.scheduledFor); // Convert string to Date

	return (
		<div>
			<p className="mb-2 text-xs text-muted-foreground">
				{Number.isNaN(date.getTime())
					? "Invalid date"
					: `Published ${formatDistanceToNow(date)} ago`}
			</p>
			<h2 className="line-clamp-1 text-lg font-semibold">{post.title}</h2>
			{post.content && post.content.length > 0 && (
				<p className="mt-2 max-w-prose text-sm">{post.content}</p>
			)}
			{(!post.content || post.content.length === 0) && (
				<p className="mt-2 text-xs text-muted-foreground">No description</p>
			)}
		</div>
	);
};

export function EditPostSheetContent({
	post,
	setOpen,
}: {
	post: PostWithAttachmentsSchemaValues;
	setOpen: (open: boolean) => void;
}) {
	const [videoStats, setVideoStats] = useState({
		views: 0,
		estimatedRevenue: 0,
		likes: 0,
		comments: 0,
		viewsPerHour: 0,
	});
	const [videoMetadata, setVideoMetadata] = useState({
		title: "",
		description: "",
		datePublished: "",
	});

	const searchParams = useSearchParams();

	// Get a new searchParams string by merging the current
	// searchParams with a provided key/value pair
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	return (
		<SheetContent
			className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0 pt-8"
			side="right"
		>
			<div className="grid gap-4 py-4">
				{/* Render multiple attachments */}
				{post.attachment && post.attachment.length > 0 && (
					<div>
						{post.attachment.map((attachment) => renderAttachment(attachment))}
					</div>
				)}

				{/* Video Metadata and Statistics */}
				{post.attachment &&
					post.attachment[0]?.file.type === FileType.video && (
						<>
							{/* Render Video Statistics */}
							{renderVideoStats(post)}

							{/* Render Video Metadata */}
							{renderVideoMetadata(post)}
						</>
					)}
			</div>
			<div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background py-4">
				<SheetClose asChild>
					<Button type="button" variant="outline">
						Cancel
					</Button>
				</SheetClose>
				<Link
					href={`/analytics?${createQueryString(
						"v",
						(post.attachment && post.id) ?? "",
					)}`}
				>
					<Button type="button">Detailed Analytics</Button>
				</Link>
			</div>
		</SheetContent>
	);
}
