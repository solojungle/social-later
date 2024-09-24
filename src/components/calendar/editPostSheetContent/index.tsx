"use client";

import { FileType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { createSerializer, parseAsString } from "nuqs";

import { formatPrice } from "@/components/singleVideoContent/revenueTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InterfaceIcons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import {
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Player } from "@/components/videoPlayer";
import { useYouTube } from "@/hooks/use-youtube";
import { PostWithAttachmentsSchemaValues } from "@/schemas/posts-schema";

// Helper function to render attachments
const renderVideoPost = ({ video, thumbnail, post }: any) => {
	return (
		<Player
			title={post.title}
			video={video.url}
			poster={thumbnail.url}
			posterAlt=""
			thumbnails=""
		/>
	);
};

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
const renderVideoStats = (passedData: any) => {
	const stats = {
		views: 0,
		likes: 0,
		comments: 0,
	};

	if (passedData) {
		stats.views = passedData.viewCount ?? 0;
		stats.likes = passedData.likeCount ?? 0;
		stats.comments = passedData.commentCount ?? 0;
	}

	const low = stats.views * 0.25;
	const high = stats.views * 4;
	const range = `${formatPrice(low, "USD")} - ${formatPrice(high, "USD")}`;

	return (
		<Card className="rounded-sm shadow-none">
			<CardContent className="grid grid-cols-4 gap-px p-4">
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
					<p className="text-xl">{range}</p>
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

export function RenderContent({ post, data }: any) {
	if (post.socialType === "youtube") {
		const video = post.attachment.find(
			(attachment: any) => attachment.file.type === FileType.video,
		);
		const thumbnail = post.attachment.find(
			(attachment: any) => attachment.file.type === FileType.image,
		);

		return (
			<div className="grid gap-4 py-4">
				<div>{renderVideoPost({ video, thumbnail, post })}</div>
				{renderVideoStats(data?.realtimeData)}
				{renderVideoMetadata(post)}
			</div>
		);
	}

	return (
		<div className="grid gap-4 py-4">
			{/* Render multiple attachments */}
			{post.attachment && post.attachment.length > 0 && (
				<div>
					{post.attachment.map((attachment: any) =>
						renderAttachment(attachment),
					)}
				</div>
			)}

			{/* Video Metadata and Statistics */}
			{post.attachment && post.attachment[0]?.file.type === FileType.video && (
				<>
					{/* Render Video Statistics */}
					{renderVideoStats(data?.realtimeData)}

					{/* Render Video Metadata */}
					{renderVideoMetadata(post)}
				</>
			)}
		</div>
	);
}

export function EditPostSheetContent({
	post,
}: {
	post: PostWithAttachmentsSchemaValues;
}) {
	const { getAnalytics } = useYouTube();
	const { data, isLoading } = getAnalytics({
		postId: post.id,
	});

	if (isLoading) {
		return (
			<SheetContent
				className="flex w-[800px] !max-w-[80vw] items-center justify-center !overflow-scroll pb-0 pt-8"
				side="right"
			>
				<SheetHeader>
					<SheetTitle />
				</SheetHeader>
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</SheetContent>
		);
	}

	const serialize = createSerializer({
		v: parseAsString,
	});

	return (
		<SheetContent
			className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0 pt-8"
			side="right"
		>
			<SheetHeader>
				<SheetTitle className="text-lg font-semibold">Post Details</SheetTitle>
			</SheetHeader>
			<RenderContent post={post} data={data} />
			<div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-background py-4">
				<SheetClose asChild>
					<Button type="button" variant="outline">
						Cancel
					</Button>
				</SheetClose>
				<Link
					href={serialize("/analytics", {
						v: (post.attachment && post.id) ?? "",
					})}
				>
					<Button type="button">Detailed Analytics</Button>
				</Link>
			</div>
		</SheetContent>
	);
}
