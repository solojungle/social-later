"use client";

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
import { FileType } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { createSerializer, parseAsString } from "nuqs";

interface Attachment {
  alt?: string;
  file: {
    type: FileType;
  };
  url: string;
}

interface VideoStats {
  comments: number;
  likes: number;
  views: number;
}

// Helper Functions
const renderVideoPlayer = (video: any, thumbnail: any, title: string) => (
  <Player
    poster={thumbnail?.url || ""}
    posterAlt={thumbnail?.alt || ""}
    thumbnails=""
    title={title}
    video={video.url}
  />
);

const renderImage = (attachment: Attachment) => (
  <img
    alt={attachment.alt || "Post content"}
    className="aspect-video w-full rounded-lg object-scale-down"
    key={attachment.url}
    src={attachment.url}
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
    comments: data?.realtimeData?.commentCount ?? 0,
    likes: data?.realtimeData?.likeCount ?? 0,
    views: data?.realtimeData?.viewCount ?? 0,
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
      {renderPostStats(
        data || { likes: 0, quotes: 0, replies: 0, reposts: 0, views: 0 },
      )}
    </>
  );
};

export function EditPostSheetContent({ post }: { post: Post }) {
  switch (post.socialType) {
    case "threads":
      return <ThreadsPostContent post={post} />;
    case "youtube":
      return <YouTubePostContent post={post} />;
    // case "facebook":
    // 	return <FacebookPostContent post={post} />;
    // case "instagram":
    // 	return <InstagramPostContent post={post} />;
    default:
      return null;
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
  data,
  post,
  title,
}: {
  data: any;
  post: Post;
  title: string;
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
      <RenderContent data={data} post={post} />
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

function RenderContent({ data, post }: { data: any; post: Post }) {
  switch (post.socialType) {
    case "threads":
      return renderThreadsPost(post, data);
    case "youtube":
      return renderYouTubePost(post, data);
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

function ThreadsPostContent({ post }: { post: Post }) {
  const { getMetrics } = useThreads();
  const { data, isLoading } = getMetrics({ postId: post.id });

  if (isLoading) {
    return <LoadingContent />;
  }

  return (
    <PostContentWrapper data={data} post={post} title="Threads Post Details" />
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
    <PostContentWrapper data={data} post={post} title="YouTube Post Details" />
  );
}
