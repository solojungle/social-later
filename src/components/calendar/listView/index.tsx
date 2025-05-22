"use client";

import { FileType } from "@prisma/client";
import { useState } from "react";

import { InterfaceIcons } from "@/components/ui/icons";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { PostWithAttachmentsSchemaValues } from "@/schemas/posts-schema";

import { EditPostSheetContent } from "../editPostSheetContent";

interface PostsProps {
  posts: any;
}

export function PostsList({ posts = [] }: PostsProps) {
  const [openPostId, setOpenPostId] = useState<null | string>(null);

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center space-x-4 rounded-md p-2 text-muted-foreground">
        <p>No posts available, try creating your first post!</p>
      </div>
    );
  }

  return (
    <div className={cn("flex w-full flex-col space-y-2")}>
      {posts.map((post: any) => (
        <UpcomingPostItem
          key={post.id}
          open={openPostId === post.id}
          post={post}
          setOpen={(open) => setOpenPostId(open ? post.id : null)}
        />
      ))}
    </div>
  );
}

function StyledStatus({ status }: { status: string }) {
  const condition = status.toLowerCase();

  const statusColors: { [key: string]: string } = {
    pending: "text-yellow-600",
    published: "text-green-600",
    rejected: "text-red-600",
  };

  return (
    <span className={`capitalize ${statusColors[condition]}`}>{status}</span>
  );
}

function UpcomingPostItem({
  open,
  post,
  setOpen,
}: {
  open: boolean;
  post: PostWithAttachmentsSchemaValues;
  setOpen: (open: boolean) => void;
}) {
  const postAttachment = post.attachment[0];
  const [imageUrl, setImageUrl] = useState(
    postAttachment?.thumbnail ?? postAttachment?.url,
  );

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild className="cursor-pointer">
        <div className="flex items-center space-x-4 rounded-md border border-border p-2">
          <div className="relative shrink-0">
            <img
              alt={post.title || "Post content"}
              className="aspect-video h-16 rounded-sm object-cover"
              onError={() => {
                setImageUrl(
                  postAttachment?.file.type === FileType.video
                    ? "images/videoPlaceholder.png"
                    : "",
                );
              }}
              src={imageUrl ?? "images/videoPlaceholder.png"}
            />
            <div className="absolute right-0 top-0 rounded-bl-sm bg-secondary p-1">
              {postAttachment?.file.type === FileType.video ? (
                <InterfaceIcons.Video className="size-3 text-secondary-foreground" />
              ) : (
                <InterfaceIcons.Image className="size-3 text-secondary-foreground" />
              )}
            </div>
          </div>
          <div className="min-w-0 grow">
            <div className="flex items-center justify-between text-xs text-secondary-foreground">
              <span className="font-medium">
                {new Date(post.scheduledFor).toLocaleDateString("en-US", {
                  day: "numeric",
                  hour: "numeric",
                  hour12: true,
                  minute: "numeric",
                  month: "long",
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
