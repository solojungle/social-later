"use client";

import { AnalyticsPageContent } from "@/components/analyticsPageContent";
import CreateTeamButton from "@/components/createTeamButton";
import { FeaturePreview } from "@/components/featurePreview";
import { ResumeSubscription } from "@/components/resumePlan";
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useUserStore } from "@/stores/user";
import { useQueryState } from "nuqs";

import { SingleVideoAnalyticsContent } from "../../../components/singleVideoContent";
import { AnalyticsPageSkeleton } from "./skeleton";

export default function AnalyticsPage() {
  const { id: userId } = useUserStore();
  const { id: teamId, stripeSubscriptionStatus } = useSelectedTeamStore();
  const { profiles } = useSocialProfilesStore();
  const [postId] = useQueryState("v");

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
          description="With analytics, you can track your team's performance and make data-driven decisions."
          title="Analytics for your team"
        >
          <div className="mb-8">
            <img
              alt="Analytics preview"
              className="aspect-video w-full rounded-lg border border-border"
              src="/images/analytics-preview-min.png"
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
    return <AnalyticsPageSkeleton />;
  }

  if (postId) {
    return <SingleVideoAnalyticsContent postId={postId} />;
  }

  return <AnalyticsPageContent />;
}
