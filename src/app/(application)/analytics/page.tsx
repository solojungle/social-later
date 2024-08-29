"use client";

import { useSearchParams } from "next/navigation";

import AddSocialProfile from "@/components/addSocialProfileButton";
import { AnalyticsPageContent } from "@/components/analyticsPageContent";
import CreateTeamButton from "@/components/createTeamButton";
import { FeaturePreview } from "@/components/featurePreview";
import { ResumeSubscription } from "@/components/resumePlan";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";

import { SingleVideoAnalyticsContent } from "../../../components/singleVideoContent";

export default function AnalyticsPage() {
	const { id: userId } = useUserStore();
	const { id: teamId, stripeSubscriptionStatus } = useSelectedTeamStore();
	const { profiles } = useSocialProfilesStore();

	const searchParams = useSearchParams();
	const video = searchParams.get("v");

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
					title="Analytics for your team"
					description="With analytics, you can track your team's performance and make data-driven decisions."
				>
					<div className="mb-8">
						<img
							alt="Analytics preview"
							src="/images/analytics-preview-min.png"
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
					description="To get started with analytics, you need to add a social profile."
				>
					<div className="mb-8">
						<img
							alt="Analytics preview"
							src="/images/analytics-preview-min.png"
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

	if (video) {
		return <SingleVideoAnalyticsContent post={video} />;
	}

	return <AnalyticsPageContent />;
}
