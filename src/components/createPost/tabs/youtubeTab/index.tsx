"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { ImageIcon } from "lucide-react";

import { BaseYouTubeForm } from "./form/base-form";
import { WithSelectedForm } from "./withSelectedForm";

export function YouTubeTab({
  scheduleDate,
  selected,
  setOpen,
}: {
  scheduleDate: Date;
  selected?: any[];
  setOpen: (open: boolean) => void;
}) {
  const { id: teamId } = useSelectedTeamStore();
  const { currentProfileId: profileId } = useSocialProfilesStore();

  // TODO: When mobile, user a drawer instead of a sheet
  return (
    <Tabs className="w-full" defaultValue="video">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="video">
          <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          Video
        </TabsTrigger>
      </TabsList>
      <TabsContent className="px-1 pt-8" value="video">
        {selected && selected.length > 0 && (
          <WithSelectedForm
            currentDate={scheduleDate}
            profileId={profileId}
            selected={selected}
            setOpen={setOpen}
            teamId={teamId}
          />
        )}

        {!selected && (
          <BaseYouTubeForm
            profileId={profileId}
            scheduleDate={scheduleDate}
            setOpen={setOpen}
            teamId={teamId}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
