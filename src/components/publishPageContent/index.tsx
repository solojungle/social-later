"use client";

import { PlusIcon } from "lucide-react";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { api } from "@/trpc/react";

import { PostsCalendar } from "../calendar";
import { CalendarDateRangePicker } from "../dateRangePicker";
import TeamSwitcher from "../navigationbar/teamSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
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

				<div className="flex select-none items-center text-xs">
					<Avatar className="relative h-8 w-8">
						<AvatarImage src="" />
						<AvatarFallback className="border border-border">A</AvatarFallback>
					</Avatar>
					<Avatar className="relative left-[-10px] h-8 w-8">
						<AvatarImage src="" />
						<AvatarFallback className="border border-border">A</AvatarFallback>
					</Avatar>
					<Avatar className="relative left-[-20px] h-8 w-8">
						<AvatarImage src="" />
						<AvatarFallback className="border border-border">A</AvatarFallback>
					</Avatar>
					<Avatar className="relative left-[-30px] h-8 w-8">
						<AvatarImage src="" />
						<AvatarFallback className="border border-border">3</AvatarFallback>
					</Avatar>
					<div className="relative left-[-30px] ml-1 flex items-center justify-center">
						<Button variant="ghost" size="icon">
							<PlusIcon className="h-4 w-4" />
						</Button>
					</div>
				</div>
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
