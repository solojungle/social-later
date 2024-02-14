"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { PostsCalendar } from "../calendar";
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
		<>
			{/* <ResizablePanel minSize={30}>
				<PlannedPosts posts={fakePosts} />
			</ResizablePanel>
			<ResizableHandle withHandle /> */}
			<ResizablePanel minSize={30} className="p-3">
				<PostsCalendar posts={posts} profileId={profileId} />
			</ResizablePanel>
		</>
	);
};
