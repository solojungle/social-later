"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";
import { ImageIcon, TypeIcon, VideoIcon } from "lucide-react";

import { returnNumberOfColumns } from "../../mediaFormField";
import { ThreadsImageForm } from "./forms/image-form";
import { ThreadsStatusForm } from "./forms/status-form";
import { ThreadsVideoForm } from "./forms/video-form";

export function ThreadsTab({
  scheduleDate,
  selected,
  setOpen,
}: {
  scheduleDate: Date;
  selected?: any[];
  setOpen: (open: boolean) => void;
}) {
  const { id: userId } = useUserStore();
  const { id: teamId } = useSelectedTeamStore();
  const { currentProfileId: profileId } = useSocialProfilesStore();

  const availableTabs = selected
    ? [String(selected[0].type)]
    : ["text", "image", "video"];
  const defaultTabsValue = availableTabs[0];
  const numberOfTabs = availableTabs.length;

  // TODO: When mobile, user a drawer instead of a sheet
  return (
    <Tabs className="w-full" defaultValue={defaultTabsValue}>
      <TabsList
        className={cn("grid w-full gap-1", returnNumberOfColumns(numberOfTabs))}
      >
        {availableTabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab === "text" && (
              <>
                <TypeIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Status
              </>
            )}
            {tab === "image" && (
              <>
                <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Image
              </>
            )}
            {tab === "video" && (
              <>
                <VideoIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                Video
              </>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent className="px-1 pt-8" value="text">
        <ThreadsStatusForm
          profileId={profileId}
          scheduleDate={scheduleDate}
          setOpen={setOpen}
          teamId={teamId}
          userId={userId}
        />
      </TabsContent>
      <TabsContent className="px-1 pt-8" value="image">
        <ThreadsImageForm
          profileId={profileId}
          scheduleDate={scheduleDate}
          selected={selected}
          setOpen={setOpen}
          teamId={teamId}
          userId={userId}
        />
      </TabsContent>
      <TabsContent className="px-1 pt-8" value="video">
        <ThreadsVideoForm
          profileId={profileId}
          scheduleDate={scheduleDate}
          selected={selected}
          setOpen={setOpen}
          teamId={teamId}
          userId={userId}
        />
      </TabsContent>
    </Tabs>
  );
}
