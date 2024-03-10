"use client";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { AddTeamMember } from "../addTeamMember";
import { PostsCalendar } from "../calendar";
import { CalendarDateRangePicker } from "../dateRangePicker";
import TeamSwitcher from "../navigationbar/teamSwitcher";
import { ResizablePanel } from "../ui/resizable";

export const PublishPageContent = () => {
	const { id: teamId } = useSelectedTeamStore();
	const { currentProfileId: profileId } = useSocialProfilesStore();

	const { data: posts } = api.post.getAll.useQuery(
		{
			teamId,
		},
		{
			enabled: !!teamId,
		},
	);

	return (
		<ResizablePanel
			id="calendar"
			order={2}
			defaultSize={80}
			className="h-full space-y-2 !overflow-scroll p-3 pb-48"
		>
			<div className="flex space-x-8">
				<TeamSwitcher />
				<AddTeamMember />
			</div>

			<div>
				<h4 className="text-sm font-medium">Date Range</h4>
				<p className="text-xs text-muted-foreground">
					Select the date range for your calendar.
				</p>
			</div>
			<CalendarDateRangePicker />
			<PostsCalendar posts={posts} profileId={profileId} />
		</ResizablePanel>
	);
};
