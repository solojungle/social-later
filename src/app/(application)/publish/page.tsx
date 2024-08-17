"use client";

import AddSocialProfile from "@/components/addSocialProfileButton";
import CreateTeamButton from "@/components/createTeamButton";
import { PublishPageContent } from "@/components/publishPageContent";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";

export default function PublishPage() {
	const { id } = useSelectedTeamStore();
	const { profiles } = useSocialProfilesStore();
	const { id: userId } = useUserStore();

	if (!userId) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!id || id.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<h2 className="mb-4">
					Please join or create a team to view the calendar.
				</h2>
				<CreateTeamButton />
			</div>
		);
	}

	// If the user hasn't added any social profiles, show the add social profile button
	if (!profiles || profiles.length === 0) {
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<h2 className="mb-4">
					Please add a social profile to view the calendar.
				</h2>
				<AddSocialProfile />
			</div>
		);
	}

	return <PublishPageContent />;
}
