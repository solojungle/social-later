"use client";

import { ImageIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { BaseYouTubeForm } from "./form/base-form";
import { WithSelectedForm } from "./withSelectedForm";

export function YouTubeTab({
	setOpen,
	scheduleDate,
	selected,
}: {
	setOpen: (open: boolean) => void;
	scheduleDate: Date;
	selected?: any[];
}) {
	const { id: teamId } = useSelectedTeamStore();
	const { currentProfileId: profileId } = useSocialProfilesStore();

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Tabs defaultValue="video" className="w-full">
			<TabsList className="grid w-full grid-cols-1">
				<TabsTrigger value="video">
					<ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />
					Video
				</TabsTrigger>
			</TabsList>
			<TabsContent value="video" className="px-1 pt-8">
				{selected && selected.length > 0 && (
					<WithSelectedForm
						teamId={teamId}
						profileId={profileId}
						setOpen={setOpen}
						currentDate={scheduleDate}
						selected={selected}
					/>
				)}

				{!selected && (
					<BaseYouTubeForm
						teamId={teamId}
						profileId={profileId}
						scheduleDate={scheduleDate}
						setOpen={setOpen}
					/>
				)}
			</TabsContent>
		</Tabs>
	);
}
