"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

const SupportedSites = [
	{
		name: "Twitter",
		icon: "twitter",
		disabled: false,
	},
	{
		name: "Facebook",
		icon: "facebook",
		disabled: true,
	},
	{
		name: "Instagram",
		icon: "instagram",
		disabled: true,
	},
	{
		name: "LinkedIn",
		icon: "linkedin",
		disabled: true,
	},
	{
		name: "Pinterest",
		icon: "pinterest",
		disabled: true,
	},
	{
		name: "TikTok",
		icon: "tiktok",
		disabled: true,
	},
	{
		name: "YouTube",
		icon: "youtube",
		disabled: true,
	},
];

function ProfileCards() {
	return (
		<div className="grid grid-cols-3 gap-1">
			{SupportedSites.map((site) => (
				<a
					href="google.com"
					className={cn(
						"flex select-none items-center justify-center rounded-lg border border-border p-10 transition-colors duration-200 ease-in-out hover:bg-gray-100",
						site.disabled && "pointer-events-none opacity-50",
					)}
					key={site.name}
				>
					<p className="font-medium">{site.name}</p>
				</a>
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
