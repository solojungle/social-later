"use client";

import AddSocialProfile from "@/components/addSocialProfileButton";
import CreateTeamButton from "@/components/createTeamButton";
import { FeaturePreview } from "@/components/featurePreview";
import { PublishPageContent } from "@/components/publishPageContent";
import { ResumeSubscription } from "@/components/resumePlan";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";

export default function PublishPage() {
	const { id: teamId, stripeSubscriptionStatus } = useSelectedTeamStore();
	const { profiles } = useSocialProfilesStore();
	const { id: userId } = useUserStore();

	if (!userId) {
		return (
			<div className="flex h-96 flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!teamId || teamId.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center">
				<FeaturePreview
					title="Create, manage, and plan your social media posts"
					description="
						With publish, you can create, manage, and plan your social media
						posts. You can also view your calendar to see when your posts are
						scheduled to go.
					"
				>
					<div className="mb-8">
						<img
							alt="Publish preview"
							src="/images/publish-preview-min.png"
							className="aspect-video w-full rounded-lg border border-border"
						/>
					</div>
					<div className="flex w-full items-center justify-between gap-2">
						<CreateTeamButton />
						<p className="text-xs text-muted-foreground">
							If you already have a team, accept the invite sent to your email.
						</p>
					</div>
				</FeaturePreview>
			</div>
		);
	}

	// Check if the teams subscription is active
	// If the team subscription is not active, show the upgrade button
	if (
		!stripeSubscriptionStatus ||
		stripeSubscriptionStatus !== "active" ||
		!teamId
	) {
		return <ResumeSubscription teamId={teamId} />;
	}

	// If the user hasn't added any social profiles, show the add social profile button
	if (!profiles || profiles.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center">
				<FeaturePreview
					title="Add a social profile to get started"
					description="To get started with publishing, you need to add a social profile."
				>
					<div className="mb-8">
						<img
							alt="Publish preview"
							src="/images/publish-preview-min.png"
							className="aspect-video w-full rounded-lg border border-border"
						/>
					</div>
					<div className="flex w-full items-center">
						<AddSocialProfile />
					</div>
				</FeaturePreview>
			</div>
		);
	}

	return <PublishPageContent />;
}
