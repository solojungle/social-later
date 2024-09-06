"use client";

import CreateTeamButton from "@/components/createTeamButton";
import { FeaturePreview } from "@/components/featurePreview";
import { MediaPageContent } from "@/components/mediaPage";
import { ResumeSubscription } from "@/components/resumePlan";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";

export default function MediaPage() {
	const { id: userId } = useUserStore();
	const { id: teamId, stripeSubscriptionStatus } = useSelectedTeamStore();

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
					title="Vault storage and media library"
					description="With vault storage, you can upload, organize, and share your media files, with your entire team."
				>
					<div className="mb-8">
						<img
							alt="Vault preview"
							src="/images/vault-preview-min.png"
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

	return (
		<div className="!overflow-scroll p-3 pb-0">
			<div className="mb-6">
				<h3 className="text-lg font-medium">Media Library</h3>
				<p className="mb-6 text-sm text-muted-foreground">
					Manage your media files. Upload, organize, and share your media.
				</p>
			</div>
			<MediaPageContent />
		</div>
	);
}
