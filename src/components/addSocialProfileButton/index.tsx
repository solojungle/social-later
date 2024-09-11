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
import { LinkYouTubeButton } from "./linkYoutubeButton";

const SupportedSites = [
	{
		name: "Facebook",
		disabled: true,
		logo: "/logos/facebook_logo.png",
	},
	{
		name: "Instagram",
		disabled: true,
		logo: "/logos/instagram_logo.png",
	},
	{
		name: "Pinterest",
		disabled: true,
		logo: "/logos/pinterest_logo.png",
	},
	{
		name: "TikTok",
		disabled: true,
		logo: "/logos/tiktok_logo.png",
	},
	{
		name: "Snapchat",
		disabled: true,
		logo: "/logos/snapchat_logo.png",
	},
];

export function ProfileCards() {
	const { id: teamId } = useSelectedTeamStore();
	return (
		<div className="grid grid-cols-3 gap-1">
			{/* <LinkTwitterButton teamId={teamId} /> */}
			{/* <LinkLinkedInButton teamId={teamId} /> */}
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
							src={site.logo}
							alt={`${site.name} logo`}
							className="mb-2 h-12 w-12"
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
