"use client";

import { useSocialProfilesStore } from "@/stores/social-profiles";

import { Separator } from "../ui/separator";
import { TwitterAnalyticsTab } from "./tabs/twitter";
import { YouTubeAnalyticsTab } from "./tabs/youtube";

export interface Increase {
	daily: number;
	weekly: number;
	monthly: number;
	annually: number;
}

export interface Totals {
	value: number;
	increase: Increase;
}

export const AnalyticsPageContent = () => {
	const { profiles, currentProfileId } = useSocialProfilesStore();

	const currentProfile = profiles.find(
		(profile) => profile.id === currentProfileId,
	);

	const profileType = currentProfile?.type;

	return (
		<div className="space-y-2 !overflow-scroll p-3 pb-48">
			<div className="mb-6">
				<h3 className="text-lg font-medium">Analytics</h3>
				<p className="mb-6 text-sm text-muted-foreground">
					Customize your analytics view. Select your preferred data range and
					visualizations.
				</p>
				<Separator className="my-6" />
			</div>
			{profileType === "twitter" && <TwitterAnalyticsTab />}
			{profileType === "youtube" && <YouTubeAnalyticsTab />}
		</div>
	);
};
