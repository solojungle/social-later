"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { AddTeamMember } from "../addTeamMember";
import { PostsCalendar } from "../calendar";
import SocialProfileSwitcher from "../socialProfileSwitcher";
import { ResizablePanel } from "../ui/resizable";

export const PublishPageContent = () => {
	const { id: teamId } = useSelectedTeamStore();
	const { currentProfileId: profileId } = useSocialProfilesStore();

	const { data: posts } = api.post.getAll.useQuery(
		{
			teamId,
		},
		{
			enabled: !!teamId,
		},
	);

	return (
		<ResizablePanel
			id="calendar"
			order={2}
			defaultSize={80}
			className="h-full space-y-2 !overflow-scroll p-3 pb-48"
		>
			<div className="flex space-x-8 border p-2">
				<SocialProfileSwitcher />
				<AddTeamMember />
			</div>

			<PostsCalendar posts={posts} profileId={profileId} />
		</ResizablePanel>
	);
};
