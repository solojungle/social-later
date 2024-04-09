"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";

import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { LinkTwitterButton } from "./linkSocialsButton";
import { LinkYouTubeButton } from "./linkYoutubeButton";

const SupportedSites = [
	{
		name: "Facebook",
		disabled: true,
	},
	{
		name: "Instagram",
		disabled: true,
	},
	{
		name: "LinkedIn",
		disabled: true,
	},
	{
		name: "Pinterest",
		disabled: true,
	},
	{
		name: "TikTok",
		disabled: true,
	},
	{
		name: "Snapchat",
		disabled: true,
	},
];

export function ProfileCards() {
	const { id: teamId } = useSelectedTeamStore();
	return (
		<div className="grid grid-cols-3 gap-1">
			<LinkTwitterButton teamId={teamId} />
			<LinkYouTubeButton teamId={teamId} />
			{SupportedSites.map((site) => (
				<div key={site.name} className="cursor-not-allowed">
					<span
						className={cn(
							"flex select-none flex-col items-center justify-center rounded-lg border-2 border-border p-10 transition-colors duration-200 ease-in-out hover:bg-secondary",
							site.disabled && "pointer-events-none opacity-30",
						)}
					>
						<img
							src={`https://logo.clearbit.com/${site.name.toLowerCase()}.com`}
							alt={`${site.name} logo`}
							className="mb-2 h-8 w-8"
						/>
						<p className="font-medium">{site.name}</p>
					</span>
				</div>
			))}
		</div>
	);
}

export default function AddSocialProfile() {
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Add profile</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new profile</DialogTitle>
					<DialogDescription>
						Add a new profile manage and create posts.
					</DialogDescription>
				</DialogHeader>
				<ProfileCards />
			</DialogContent>
		</Dialog>
	);
}
