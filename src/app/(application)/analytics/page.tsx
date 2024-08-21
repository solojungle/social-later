"use client";

import { AnalyticsPageContent } from "@/components/analyticsPageContent";
import CreateTeamButton from "@/components/createTeamButton";
import { FeaturePreview } from "@/components/featurePreview";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";

export default function AnalyticsPage() {
	const { id: userId } = useUserStore();
	const { id: teamId } = useSelectedTeamStore();

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

	return <AnalyticsPageContent />;
}
