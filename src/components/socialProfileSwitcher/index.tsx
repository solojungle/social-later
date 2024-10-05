"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, PlusIcon } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { ProfileCards } from "../addSocialProfileButton";

// Types
type SocialProfile = {
	teamId: string;
	id: string;
	username: string;
	type: string;
	avatar: string;
	name?: string | null;
};

type ChannelIconProps = {
	type: string;
};

type CommandGroupProps = {
	setOpen: (open: boolean) => void;
};

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

// Constants
const CHANNEL_ICONS: Record<string, string> = {
	twitter: "/logos/twitter_logo.webp",
	youtube: "/logos/youtube_logo.webp",
	linkedin: "/logos/linkedin_logo.webp",
	threads: "/logos/threads_logo.png",
};

// Helper functions
const getAvatarFallback = (profile: SocialProfile): string =>
	(profile.name && profile.name[0]?.toUpperCase()) ??
	profile.username[0]?.toUpperCase() ??
	"";

// Components
const ChannelServiceIcon: React.FC<ChannelIconProps> = ({ type }) => (
	<img
		src={CHANNEL_ICONS[type]}
		alt={type}
		className="absolute bottom-0 right-0 m-px w-[14px] rounded-sm"
	/>
);

const ProfileAvatar: React.FC<{ profile: SocialProfile }> = ({ profile }) => (
	<Avatar className="relative mr-2 h-7 w-7 !rounded-sm">
		<ChannelServiceIcon type={profile.type} />
		<AvatarImage
			src={profile.avatar}
			className="!rounded-sm border border-border bg-background"
		/>
		<AvatarFallback className="!rounded-sm border border-border">
			{getAvatarFallback(profile)}
		</AvatarFallback>
	</Avatar>
);

const SocialProfilesCommandGroup: React.FC<CommandGroupProps> = ({
	setOpen,
}) => {
	const { profiles, currentProfileId, setCurrentProfile } =
		useSocialProfilesStore();

	return (
		<CommandGroup key="profiles" heading="Profiles">
			{profiles.map((profile: SocialProfile) => (
				<CommandItem
					key={profile.id}
					value={profile.username}
					onSelect={() => {
						setCurrentProfile(profile);
						setOpen(false);
					}}
					className="text-sm"
				>
					<ProfileAvatar profile={profile} />
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
};

const SocialProfileSwitcherPopoverTrigger: React.FC<
	PopoverTriggerProps & { open: boolean }
> = ({ className, open }) => {
	const { profiles, currentProfileId, setCurrentProfile } =
		useSocialProfilesStore();
	const selectedProfile = profiles.find(
		(profile) => profile.id === currentProfileId,
	);

	useEffect(() => {
		if (!selectedProfile && profiles.length > 0) {
			if (profiles[0]) {
				setCurrentProfile(profiles[0]);
			}
		}
	}, [selectedProfile, profiles, setCurrentProfile]);

	if (!selectedProfile) return null;

	return (
		<PopoverTrigger>
			<Button
				asChild
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a profile"
				className={cn("w-20 justify-between md:w-[250px]", className)}
			>
				<div>
					<ProfileAvatar profile={selectedProfile} />
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
};

export const SocialProfileSwitcher: React.FC<PopoverTriggerProps> = ({
	className,
}) => {
	const [open, setOpen] = useState(false);
	const [showNewProfileDialog, setShowNewProfileDialog] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<Dialog open={showNewProfileDialog} onOpenChange={setShowNewProfileDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<SocialProfileSwitcherPopoverTrigger
					className={className}
					open={open}
				/>
				<PopoverContent className="w-[250px] p-0" align="start">
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
};
