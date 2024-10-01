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
import { useThreads } from "@/hooks/use-threads";
import { useYouTube } from "@/hooks/use-youtube";
import { PostWithAttachmentsSchemaValues as Post } from "@/schemas/posts-schema";

interface Attachment {
	url: string;
	alt?: string;
	file: {
		type: FileType;
	};
}

interface VideoStats {
	views: number;
	likes: number;
	comments: number;
}

// Helper Functions
const renderVideoPlayer = (video: any, thumbnail: any, title: string) => (
	<Player
		title={title}
		video={video.url}
		poster={thumbnail?.url || ""}
		posterAlt={thumbnail?.alt || ""}
		thumbnails=""
	/>
);

const renderImage = (attachment: Attachment) => (
	<img
		key={attachment.url}
		src={attachment.url}
		alt={attachment.alt || "Post content"}
		className="aspect-video w-full rounded-lg object-scale-down"
	/>
);

const renderAttachment = (attachment: any) => {
	switch (attachment.file.type) {
		case FileType.image:
			return renderImage(attachment);
		case FileType.video:
			return renderVideoPlayer(attachment, {} as Attachment, "");
		default:
			return null;
	}
};

const calculateRevenueRange = (views: number): string => {
	const low = views * 0.25;
	const high = views * 4;
	return `${formatPrice(low, "USD")} - ${formatPrice(high, "USD")}`;
};

const renderPostStats = (stats: VideoStats) => (
	<Card className="rounded-sm shadow-none">
		<CardContent className="grid grid-cols-4 gap-px p-4">
			{Object.entries(stats).map(([key, value]) => (
				<div key={key}>
					<Label className="text-xs">
						{key.charAt(0).toUpperCase() + key.slice(1)}
					</Label>
					<p className="text-xl">{value.toLocaleString()}</p>
				</div>
			))}
			<div>
				<Label className="text-xs">Est. Revenue</Label>
				<p className="text-xl">{calculateRevenueRange(stats.views)}</p>
			</div>
		</CardContent>
	</Card>
);

const renderPostMetadata = (post: Post) => {
	const date = new Date(post.scheduledFor);
	const formattedDate = Number.isNaN(date.getTime())
		? "Invalid date"
		: `Published ${formatDistanceToNow(date)} ago`;

	return (
		<div className="py-2">
			<p className="mb-2 text-xs text-muted-foreground">{formattedDate}</p>
			<h2 className="line-clamp-1 text-lg font-semibold">{post.title}</h2>
			{post.content ? (
				<p className="mt-2 max-w-prose text-sm">{post.content}</p>
			) : (
				<p className="mt-2 text-xs text-muted-foreground">No description</p>
			)}
		</div>
	);
};

const renderPostStatus = (post: Post) => {
	const date = new Date(post.scheduledFor);
	const formattedDate = Number.isNaN(date.getTime())
		? "Invalid date"
		: `Published ${formatDistanceToNow(date)} ago`;

	return (
		<div className="mb-2 mt-4 rounded-sm border border-border px-2 py-3">
			{post.content && (
				<p className="my-2 max-w-prose text-lg">{post.content}</p>
			)}
			<p className="text-xs text-muted-foreground">{formattedDate}</p>
		</div>
	);
};

// Platform-specific renderers
const renderYouTubePost = (post: Post, data: any) => {
	const video = post.attachment.find((a) => a.file.type === FileType.video);
	const thumbnail = post.attachment.find((a) => a.file.type === FileType.image);

	if (!video || !video.url || typeof video.url === null) return null;

	const videoStats = {
		views: data?.realtimeData?.viewCount ?? 0,
		likes: data?.realtimeData?.likeCount ?? 0,
		comments: data?.realtimeData?.commentCount ?? 0,
	};

	return (
		<>
			{renderVideoPlayer(video, thumbnail || ({} as Attachment), post.title)}
			{renderPostStats(videoStats)}
			{renderPostMetadata(post)}
		</>
	);
};

const renderThreadsPost = (post: Post, data: any) => {
	return (
		<>
			{post.attachment.map(renderAttachment)}
			{renderPostStatus(post)}
			{renderPostStats(data || { views: 0, likes: 0, comments: 0 })}
		</>
	);
};

function RenderContent({ post, data }: { post: Post; data: any }) {
	switch (post.socialType) {
		case "youtube":
			return renderYouTubePost(post, data);
		case "threads":
			return renderThreadsPost(post, data);
		// case "facebook":
		// 	return renderFacebookPost(post, data);
		// case "instagram":
		// 	return renderInstagramPost(post, data);
		default:
			return (
				<>
					{post.attachment.map(renderAttachment)}
					{renderPostMetadata(post)}
				</>
			);
	}
}

function LoadingContent() {
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

function PostContentWrapper({
	title,
	post,
	data,
}: {
	title: string;
	post: Post;
	data: any;
}) {
	const serialize = createSerializer({ v: parseAsString });

	return (
		<SheetContent
			className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0 pt-8"
			side="right"
		>
			<SheetHeader>
				<SheetTitle className="text-lg font-semibold">{title}</SheetTitle>
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

// Platform-specific Content Components
function YouTubePostContent({ post }: { post: Post }) {
	const { getAnalytics } = useYouTube();
	const { data, isLoading } = getAnalytics({ postId: post.id });

	if (isLoading) {
		return <LoadingContent />;
	}

	return (
		<PostContentWrapper title="YouTube Post Details" post={post} data={data} />
	);
}

function ThreadsPostContent({ post }: { post: Post }) {
	const { getMetrics } = useThreads();
	const { data, isLoading } = getMetrics({ postId: post.id });

	if (isLoading) {
		return <LoadingContent />;
	}

	return (
		<PostContentWrapper title="Threads Post Details" post={post} data={data} />
	);
}

export function EditPostSheetContent({ post }: { post: Post }) {
	switch (post.socialType) {
		case "youtube":
			return <YouTubePostContent post={post} />;
		case "threads":
			return <ThreadsPostContent post={post} />;
		// case "facebook":
		// 	return <FacebookPostContent post={post} />;
		// case "instagram":
		// 	return <InstagramPostContent post={post} />;
		default:
			return null;
	}
}
