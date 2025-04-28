"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useState } from "react";

import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { ThreadsTab } from "./tabs/threadsTab";
import { TwitterTab } from "./tabs/twitterTab";
import { YouTubeTab } from "./tabs/youtubeTab";

interface CreatePostProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  profileId: string;
  scheduleDate: Date;
  selected?: any[];
}

interface PostFormProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  scheduleDate: Date;
  selected?: any[];
  teamId: string;
}

export function CreatePost({
  className,
  profileId,
  scheduleDate,
  selected,
  ...props
}: CreatePostProps) {
  const { id: teamId } = useSelectedTeamStore();

  if (!teamId || teamId === "" || !profileId || profileId === "") {
    return null;
  }

  return (
    <PostForm
      className={className}
      scheduleDate={scheduleDate}
      selected={selected}
      teamId={teamId}
      {...props}
    />
  );
}

function PostForm({
  className,
  scheduleDate,
  selected,
  ...props
}: PostFormProps) {
  const [open, setOpen] = useState(false);

  const { profileType } = useSocialProfilesStore();

  if (!profileType) {
    return null;
  }

  // TODO: When mobile, user a drawer instead of a sheet
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button className={className} {...props}>
          Post
        </Button>
      </SheetTrigger>
      <SheetContent
        className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0 pt-4"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="sr-only">Create Post</SheetTitle>
        </SheetHeader>
        <div className="mb-4">
          <SocialProfileSwitcher />
        </div>
        <TooltipProvider delayDuration={0}>
          {profileType === "twitter" && (
            <TwitterTab scheduleDate={scheduleDate} setOpen={setOpen} />
          )}
          {profileType === "threads" && (
            <ThreadsTab
              scheduleDate={scheduleDate}
              selected={selected}
              setOpen={setOpen}
            />
          )}
          {profileType === "youtube" && (
            <YouTubeTab
              scheduleDate={scheduleDate}
              selected={selected}
              setOpen={setOpen}
            />
          )}
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
