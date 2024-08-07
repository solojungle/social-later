"use client";

import AddSocialProfile from "@/components/addSocialProfileButton";
import CreateTeamButton from "@/components/createTeamButton";
import { PublishPageContent } from "@/components/publishPageContent";
import { InterfaceIcons } from "@/components/ui/icons";
import { ResizablePanel } from "@/components/ui/resizable";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";

export default function PublishPage() {
	const { id } = useSelectedTeamStore();
	const { profiles } = useSocialProfilesStore();
	const { id: userId } = useUserStore();

	if (!userId) {
		return (
			<ResizablePanel id="no-user-loading" order={2} defaultSize={80}>
				<div className="flex h-full flex-col items-center justify-center">
					<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
				</div>
			</ResizablePanel>
		);
	}

	if (!id || id.length === 0) {
		return (
			<ResizablePanel id="no-team" order={2} defaultSize={80}>
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
			<ResizablePanel id="no-profiles" order={2} defaultSize={80}>
				<div className="flex h-full flex-col items-center justify-center">
					<h2 className="mb-4">
						Please add a social profile to view the calendar.
					</h2>
					<AddSocialProfile />
				</div>
			</ResizablePanel>
		);
	}

	return <PublishPageContent />;
}
