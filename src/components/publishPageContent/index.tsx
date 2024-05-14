"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { AddTeamMember } from "../addTeamMember";
import { PostsCalendar } from "../calendar";
import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { ResizablePanel } from "../ui/resizable";

type PublishPageContentProps = {
	inviteCode: string | null;
};

export const PublishPageContent = ({ inviteCode }: PublishPageContentProps) => {
	const { id: teamId } = useSelectedTeamStore();
	const { currentProfileId: profileId } = useSocialProfilesStore();
	const utils = api.useUtils();
	const router = useRouter();

	const { mutate: acceptInvite } = api.invitation.accept.useMutation({
		onSuccess: () => {
			// Refetch the team
			utils.team.getMembers.invalidate();
		},
		onSettled: () => {
			// remove the invite code from the URL
			router.push("/publish");
		},
	});

	const { data: posts } = api.post.getAll.useQuery(
		{
			teamId,
		},
		{
			enabled: !!teamId,
		},
	);

	// Wrapping in useEffect to avoid calling acceptInvite on every render
	useEffect(() => {
		if (inviteCode) {
			acceptInvite({
				inviteCode,
			});
		}
	}, [acceptInvite, inviteCode]);

	return (
		<ResizablePanel
			id="calendar"
			order={2}
			defaultSize={80}
			className="h-full space-y-3 !overflow-scroll p-3"
		>
			<div className="flex space-x-6">
				<SocialProfileSwitcher />
				<AddTeamMember />
			</div>

			<PostsCalendar posts={posts} profileId={profileId} />
		</ResizablePanel>
	);
};
