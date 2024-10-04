"use client";

import { ImageIcon, TypeIcon, VideoIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";

import { ThreadsImageForm } from "./forms/image-form";
import { ThreadsStatusForm } from "./forms/status-form";
import { ThreadsVideoForm } from "./forms/video-form";

export function ThreadsTab({
	setOpen,
	scheduleDate,
	selected,
}: {
	setOpen: (open: boolean) => void;
	scheduleDate: Date;
	selected?: any[];
}) {
	const { id: userId } = useUserStore();
	const { id: teamId } = useSelectedTeamStore();
	const { currentProfileId: profileId } = useSocialProfilesStore();

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Tabs defaultValue="text" className="w-full">
			<TabsList className="grid w-full grid-cols-3 gap-1">
				<TabsTrigger value="text">
					<TypeIcon className="mr-2 size-4 text-muted-foreground" />
					Status
				</TabsTrigger>
				<TabsTrigger value="image">
					<ImageIcon className="mr-2 size-4 text-muted-foreground" />
					Image
				</TabsTrigger>
				<TabsTrigger value="video">
					<VideoIcon className="mr-2 size-4 text-muted-foreground" />
					Video
				</TabsTrigger>
			</TabsList>
			<TabsContent value="text" className="px-1 pt-8">
				<ThreadsStatusForm
					userId={userId}
					scheduleDate={scheduleDate}
					profileId={profileId}
					teamId={teamId}
					setOpen={setOpen}
				/>
			</TabsContent>
			<TabsContent value="image" className="px-1 pt-8">
				<ThreadsImageForm
					userId={userId}
					scheduleDate={scheduleDate}
					profileId={profileId}
					teamId={teamId}
					setOpen={setOpen}
				/>
			</TabsContent>
			<TabsContent value="video" className="px-1 pt-8">
				<ThreadsVideoForm
					userId={userId}
					scheduleDate={scheduleDate}
					profileId={profileId}
					teamId={teamId}
					setOpen={setOpen}
					selected={selected}
				/>
			</TabsContent>
		</Tabs>
	);
}
