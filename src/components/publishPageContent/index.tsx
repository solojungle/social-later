"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { PostsCalendar } from "../calendar";
import { PostsList } from "../calendar/listView";

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
		<div className="mb-3 flex h-full w-full !overflow-scroll p-3">
			<PostsList
				posts={posts ?? []}
				profileId={profileId}
				className="md:hidden"
			/>
			<PostsCalendar
				posts={posts}
				profileId={profileId}
				className="hidden md:flex"
			/>
		</div>
	);
};
