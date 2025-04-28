"use client";

import { cn } from "@/lib/utils";
import { PostWithAttachmentsSchemaValues } from "@/schemas/posts-schema";
import { FileType } from "@prisma/client";
import { ChevronLeft, ChevronRight, ImageIcon, VideoIcon } from "lucide-react";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useState } from "react";

import { CreatePost } from "../createPost";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { EditPostSheetContent } from "./editPostSheetContent";

// This is the component that will be rendered on a day of the calendar
// It will show the posts that are scheduled for that day
function Posts({
  posts = [],
}: {
  posts: PostWithAttachmentsSchemaValues[] | undefined;
}) {
  const [open, setOpen] = useState(false);

  if (posts.length === 0) {
    return null;
  }

  const post = posts[0];

  if (!post) {
    return null;
  }

  // if (post.socialType === "threads") {
  // 	return (
  // 		<Sheet open={open} onOpenChange={setOpen}>
  // 			<SheetTrigger asChild className="cursor-pointer">
  // 				<div className="m-px flex aspect-video flex-col rounded-sm border border-border bg-secondary p-2 text-xs text-secondary-foreground shadow-md">
  // 					<div className="flex items-center justify-between">
  // 						<span className="mb-1 font-medium">
  // 							{post.scheduledFor.toLocaleString("en-US", {
  // 								hour: "numeric",
  // 								minute: "numeric",
  // 								hour12: true,
  // 							})}
  // 						</span>
  // 						{StyledStatus({ status: post.status })}
  // 					</div>
  // 					<span>{post.content && post.content.slice(0, 50)}</span>
  // 				</div>
  // 			</SheetTrigger>
  // 			<EditPostSheetContent post={post} />
  // 		</Sheet>
  // 	);
  // }

  if (post.attachment.length > 0) {
    return StyledMediaPost({ open, post, setOpen });
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild className="cursor-pointer">
        <div className="m-px flex aspect-video flex-col rounded-sm border border-border bg-secondary p-2 text-xs text-secondary-foreground shadow-md">
          <div className="flex items-center justify-between">
            <span className="mb-1 font-medium">
              {post.scheduledFor.toLocaleString("en-US", {
                hour: "numeric",
                hour12: true,
                minute: "numeric",
              })}
            </span>
            {StyledStatus({ status: post.status })}
          </div>
          <span>{post.content && post.content.slice(0, 50)}</span>
        </div>
      </SheetTrigger>
      <EditPostSheetContent post={post} />
    </Sheet>
  );
}

function StyledMediaPost({
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
    postAttachment && (postAttachment.thumbnail ?? postAttachment.url),
  );

  if (!imageUrl || imageUrl === null) {
    return null;
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild className="cursor-pointer">
        <div className="relative m-px rounded-sm border border-border shadow-md">
          <div className="flex flex-col">
            <div className="absolute right-2 top-2 rounded-sm bg-secondary p-1">
              {(post.attachment &&
                post.attachment[0]?.file.type === FileType.video) ||
              post.socialType === "youtube" ? (
                <VideoIcon className="h-4 w-4 text-secondary-foreground" />
              ) : (
                <ImageIcon className="h-4 w-4 text-secondary-foreground" />
              )}
            </div>
            <img
              alt={post.title || "Post content"}
              className="aspect-video rounded-sm object-cover"
              onError={() => {
                if (
                  post.attachment &&
                  post.attachment[0]?.file.type === FileType.video
                ) {
                  setImageUrl("images/videoPlaceholder.png");
                  return;
                }

                // If the thumbnail is not available, we will use the post content
                setImageUrl((postAttachment && postAttachment.url) ?? "");
              }}
              src={imageUrl}
            />
          </div>
          <div className="absolute bottom-0 flex w-full flex-col rounded-b  bg-secondary p-2 text-xs text-secondary-foreground">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {post.scheduledFor.toLocaleString("en-US", {
                  hour: "numeric",
                  hour12: true,
                  minute: "numeric",
                })}
              </span>

              {StyledStatus({ status: post.status })}
            </div>
            <span className="truncate">
              {post.content && post.content.slice(0, 50)}
            </span>
          </div>
        </div>
      </SheetTrigger>
      <EditPostSheetContent post={post} />
    </Sheet>
  );
}

function StyledStatus({ status }: { status: string }) {
  const condition = status.toLowerCase();

  if (condition === "published") {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-green-500" />
        </TooltipTrigger>
        <TooltipContent>Published</TooltipContent>
      </Tooltip>
    );
  }
  if (condition === "pending") {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
        </TooltipTrigger>
        <TooltipContent>Pending</TooltipContent>
      </Tooltip>
    );
  }
  if (condition === "rejected") {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-red-500" />
        </TooltipTrigger>
        <TooltipContent>Rejected</TooltipContent>
      </Tooltip>
    );
  }

  return null;
}

const CalendarDay = ({
  day,
  isDisabled,
  isOtherMonth,
  isPrevious,
  isToday,
  posts,
  profileId,
}: {
  day: number;
  isDisabled: boolean;
  isOtherMonth: boolean;
  isPrevious: boolean;
  isToday: boolean;
  posts: PostWithAttachmentsSchemaValues[];
  profileId: string;
}) => {
  return (
    <div
      className={`group grid bg-background ${
        isOtherMonth && "opacity-60"
      } flex flex-col`}
    >
      <time
        className={`m-1 mb-4 flex h-5 w-5 items-center justify-center rounded-full  text-xs text-muted-foreground ${
          isToday
            ? "bg-primary font-semibold text-primary-foreground"
            : "font-light"
        }`}
      >
        {day}
      </time>
      {posts && posts.length > 0 && <Posts posts={posts} />}
      {posts.length === 0 && <div className="relative aspect-video" />}
      {!isDisabled && (!isPrevious || isToday) ? (
        <CreatePost
          className="invisible mt-px w-full group-hover:visible"
          profileId={profileId}
          scheduleDate={new Date()}
        />
      ) : (
        <CreatePost
          className="invisible mt-px w-full"
          profileId={profileId}
          scheduleDate={new Date()}
        />
      )}
    </div>
  );
};

export function PostsCalendar({ className, posts = [], profileId }: any) {
  const [params, setParams] = useQueryStates({
    month: parseAsInteger.withDefault(new Date().getMonth()),
    year: parseAsInteger.withDefault(new Date().getFullYear()),
  });

  const changeMonth = (increment: number) => {
    const newDate = new Date(params.year, params.month + increment);
    setParams({
      month: newDate.getMonth(),
      year: newDate.getFullYear(),
    });
  };

  const generateCalendarDays = () => {
    const firstDay = new Date(params.year, params.month, 1).getDay();
    const daysInMonth = new Date(params.year, params.month + 1, 0).getDate();
    const today = new Date();

    const days = [];
    for (let i = 1; i <= 35; i += 1) {
      const day = i - firstDay;
      const isCurrentMonth = day > 0 && day <= daysInMonth;
      const currentDate = new Date(params.year, params.month, day);

      days.push({
        // eslint-disable-next-line no-nested-ternary
        day: isCurrentMonth
          ? day
          : day <= 0
          ? new Date(params.year, params.month, 0).getDate() + day
          : day - daysInMonth,
        isDisabled: !isCurrentMonth,
        isOtherMonth: !isCurrentMonth,
        isPrevious: currentDate <= new Date(),
        isToday: currentDate.toDateString() === today.toDateString(),
        posts: isCurrentMonth
          ? posts.filter(
              (p: { scheduledFor: Date | number | string }) =>
                new Date(p.scheduledFor).toDateString() ===
                currentDate.toDateString(),
            )
          : [],
      });
    }
    return days;
  };

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex items-center space-x-4 rounded-t border border-b-0 p-2">
        <Button onClick={() => changeMonth(-1)} variant="ghost">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="flex w-36 justify-center font-semibold">
          {new Date(params.year, params.month).toLocaleString("default", {
            month: "long",
          })}
          , {params.year}
        </span>
        <Button onClick={() => changeMonth(1)} variant="ghost">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-auto flex-col pb-24">
        <div className="grid grid-cols-7 gap-px bg-border p-px pb-0 text-center text-xs font-semibold leading-6">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div className="bg-background py-2 text-foreground" key={day}>
              {day.charAt(0)}
              <span>{day.slice(1)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-auto bg-border text-xs leading-6 text-foreground">
          <div className="grid w-full grid-cols-7 grid-rows-5 gap-px border">
            {generateCalendarDays().map((dayInfo, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <CalendarDay key={index} {...dayInfo} profileId={profileId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
