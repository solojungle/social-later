"use client";

import AddSocialProfile from "@/components/addSocialProfileButton";
import { PostsCalendar } from "@/components/calendar";
import CreateTeamButton from "@/components/createTeamButton";
import { ResizablePanel } from "@/components/ui/resizable";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

export default function PublishPage() {
	function randomDateThisMonth() {
		const random = new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			Math.floor(Math.random() * 31) + 1,
		);

		return random;
	}

	const { data: posts } = api.post.getAll.useQuery({
		teamId: "1",
	});

	const { type } = useSelectedTeamStore();
	const { profiles } = useSocialProfilesStore();

	if (!type || type === "personal") {
		return (
			<ResizablePanel minSize={30}>
				<div className="flex h-full flex-col items-center justify-center">
					<h2 className="mb-4">
						Please join or create a team to view the calendar.
					</h2>
					<CreateTeamButton />
				</div>
			</ResizablePanel>
		);
	}

	// If the user hasn't added any social profiles, show the add social profile button
	if (!profiles || profiles.length === 0) {
		return (
			<ResizablePanel minSize={30}>
				<div className="flex h-full flex-col items-center justify-center">
					<h2 className="mb-4">
						Please add a social profile to view the calendar.
					</h2>
					<AddSocialProfile />
				</div>
			</ResizablePanel>
		);
	}

	return (
		<>
			{/* <ResizablePanel minSize={30}>
				<PlannedPosts posts={fakePosts} />
			</ResizablePanel>
			<ResizableHandle withHandle /> */}
			<ResizablePanel minSize={30} className="p-3">
				<PostsCalendar posts={posts} />
			</ResizablePanel>
		</>
	);
}
