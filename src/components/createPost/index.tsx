"use client";

import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useSelectedTeamStore } from "@/stores/selected-team";

import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { TwitterTab } from "./tabs/twitterTab";

function TweetForm({
	teamId,
	profileId,
	className,
	scheduleDate,
}: {
	teamId: string;
	profileId: string;
	className?: string;
	scheduleDate: Date;
}) {
	const [open, setOpen] = useState(false);

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button className={className}>Post</Button>
			</SheetTrigger>
			<SheetContent
				className="w-[800px] !max-w-[80vw] !overflow-scroll pt-4"
				side="right"
			>
				<div className="mb-4">
					<SocialProfileSwitcher />
				</div>
				<TooltipProvider delayDuration={0}>
					<TwitterTab
						teamId={teamId}
						profileId={profileId}
						setOpen={setOpen}
						scheduleDate={scheduleDate}
					/>
				</TooltipProvider>
			</SheetContent>
		</Sheet>
	);
}

export function CreatePost({
	className,
	scheduleDate,
	profileId,
}: {
	profileId: string;
	scheduleDate: Date;
	className?: string;
}) {
	const { id: teamId } = useSelectedTeamStore();

	if (!teamId || teamId === "" || !profileId || profileId === "") {
		return null;
	}

	return (
		<TweetForm
			className={className}
			teamId={teamId}
			profileId={profileId}
			scheduleDate={scheduleDate}
		/>
	);
}
