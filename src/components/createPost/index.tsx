"use client";

import { useState } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { SocialProfileSwitcher } from "../socialProfileSwitcher";
import { Button } from "../ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../ui/sheet";
import { TwitterTab } from "./tabs/twitterTab";
import { YouTubeTab } from "./tabs/youtubeTab";

interface PostFormProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	teamId: string;
	profileId: string;
	scheduleDate: Date;
	selected?: any[];
}

function PostForm({
	teamId,
	profileId,
	className,
	scheduleDate,
	selected,
	...props
}: PostFormProps) {
	const [open, setOpen] = useState(false);

	const { profiles } = useSocialProfilesStore();

	const profileType = profiles.find((p) => p.id === profileId)?.type;

	if (!profileType) {
		return null;
	}

	// TODO: When mobile, user a drawer instead of a sheet
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button className={className} {...props}>
					Post
				</Button>
			</SheetTrigger>
			<SheetContent
				className="w-[800px] !max-w-[80vw] !overflow-scroll pb-0 pt-4"
				side="right"
			>
				<SheetHeader>
					<SheetTitle className="text-lg font-semibold">Create Post</SheetTitle>
				</SheetHeader>
				<div className="mb-4">
					<SocialProfileSwitcher />
				</div>
				<TooltipProvider delayDuration={0}>
					{profileType === "twitter" && (
						<TwitterTab
							teamId={teamId}
							profileId={profileId}
							setOpen={setOpen}
							scheduleDate={scheduleDate}
						/>
					)}
					{profileType === "youtube" && (
						<YouTubeTab
							teamId={teamId}
							profileId={profileId}
							setOpen={setOpen}
							scheduleDate={scheduleDate}
							selected={selected}
						/>
					)}
				</TooltipProvider>
			</SheetContent>
		</Sheet>
	);
}

interface CreatePostProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	profileId: string;
	scheduleDate: Date;
	selected?: any[];
}

export function CreatePost({
	className,
	scheduleDate,
	profileId,
	selected,
	...props
}: CreatePostProps) {
	const { id: teamId } = useSelectedTeamStore();

	if (!teamId || teamId === "" || !profileId || profileId === "") {
		return null;
	}

	return (
		<PostForm
			className={className}
			teamId={teamId}
			profileId={profileId}
			scheduleDate={scheduleDate}
			selected={selected}
			{...props}
		/>
	);
}
