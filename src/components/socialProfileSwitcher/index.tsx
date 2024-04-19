"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { ProfileCards } from "../addSocialProfileButton";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type PersonalCommandGroupProps = {
	setOpen: (open: boolean) => void;
};

function ChannelServiceIcon({ type }: { type: string }) {
	// These will be different lucide icons
	const channelIconVariants: { [key: string]: any } = {
		twitter: "/logos/twitter_logo.webp",
		youtube: "/logos/youtube_logo.webp",
		linkedin: "/logos/linkedin_logo.webp",
	};

	return (
		<img
			src={channelIconVariants[type]}
			alt={type}
			className="absolute bottom-0 right-0 m-px w-[14px] rounded-sm"
		/>
	);
}

function SocialProfilesCommandGroup({ setOpen }: PersonalCommandGroupProps) {
	const { profiles, currentProfileId, setCurrentProfileId } =
		useSocialProfilesStore();

	return (
		<CommandGroup key="profiles" heading="Profiles">
			{profiles.map((profile) => (
				<CommandItem
					key={profile.id}
					value={profile.username}
					onSelect={() => {
						// Set the current profile
						setCurrentProfileId(profile.id);

						setOpen(false);
					}}
					className="text-sm"
				>
					<Avatar className="relative mr-2 h-7 w-7 !rounded-sm">
						{ChannelServiceIcon({ type: profile.type })}
						<AvatarImage
							src={profile.avatar}
							alt={profile.name || profile.username}
							className="!rounded-sm border border-border bg-white"
						/>
						<AvatarFallback className="!rounded-sm border border-border">
							{(profile.name && profile.name[0]?.toUpperCase()) ??
								profile.username[0]?.toUpperCase() ??
								""}
						</AvatarFallback>
					</Avatar>
					<span
						title={profile.name || profile.username}
						className="overflow-hidden truncate"
					>
						{profile.name || profile.username}
					</span>
					<CheckIcon
						className={cn(
							"ml-auto h-4 w-4",
							currentProfileId === profile.id ? "opacity-100" : "opacity-0",
						)}
					/>
				</CommandItem>
			))}
		</CommandGroup>
	);
}

type SocialProfileSwitcherPopoverTriggerProps = PopoverTriggerProps & {
	open: boolean; // Define the 'open' prop
};

function SocialProfileSwitcherPopoverTrigger({
	className,
	open,
}: SocialProfileSwitcherPopoverTriggerProps) {
	const { profiles, currentProfileId } = useSocialProfilesStore();

	const selectedProfile = profiles.find(
		(profile) => profile.id === currentProfileId,
	);

	if (!selectedProfile) {
		return null;
	}

	return (
		<PopoverTrigger>
			<Button
				asChild
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a profile"
				className={cn("w-[250px] justify-between", className)}
			>
				<div>
					<Avatar className="relative mr-2 h-6 w-6 !rounded-sm">
						{ChannelServiceIcon({ type: selectedProfile.type })}
						<AvatarImage
							src={selectedProfile.avatar}
							alt={selectedProfile.name ?? selectedProfile.username}
							className="!rounded-sm border border-border bg-white"
						/>
						<AvatarFallback className="!rounded-sm border border-border">
							{(selectedProfile.name &&
								selectedProfile.name[0]?.toUpperCase()) ??
								selectedProfile.username[0]?.toUpperCase() ??
								""}
						</AvatarFallback>
					</Avatar>
					<span
						title={selectedProfile.name || selectedProfile.username}
						className="overflow-hidden truncate"
					>
						{selectedProfile.name || selectedProfile.username}
					</span>
					<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
				</div>
			</Button>
		</PopoverTrigger>
	);
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

type SocialProfileSwitcherProps = PopoverTriggerProps;

export function SocialProfileSwitcher({
	className,
}: SocialProfileSwitcherProps) {
	const [open, setOpen] = useState(false);
	const [showNewProfileDialog, setShowNewProfileDialog] = useState(false);

	return (
		<Dialog open={showNewProfileDialog} onOpenChange={setShowNewProfileDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<SocialProfileSwitcherPopoverTrigger
					className={className}
					open={open}
				/>
				<PopoverContent className="w-[250px] p-0">
					<Command>
						<CommandInput placeholder="Search profiles..." />
						<CommandList>
							<CommandEmpty>No profiles found.</CommandEmpty>
							<SocialProfilesCommandGroup setOpen={setOpen} />
						</CommandList>
						<CommandList>
							<CommandGroup>
								<CommandItem
									onSelect={() => {
										setOpen(false);
										setShowNewProfileDialog(true);
									}}
								>
									<PlusIcon className="mr-2 h-4 w-4" />
									Add profile
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add a social profile</DialogTitle>
					<DialogDescription>
						Connect your social profile to manage your posts.
					</DialogDescription>
				</DialogHeader>
				<ProfileCards />
			</DialogContent>
		</Dialog>
	);
}
