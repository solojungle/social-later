"use client";

import {
	CaretSortIcon,
	PlusCircledIcon,
	TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { CheckIcon } from "lucide-react";
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

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type PersonalCommandGroupProps = {
	setOpen: (open: boolean) => void;
};

function SocialProfilesCommandGroup({ setOpen }: PersonalCommandGroupProps) {
	const { profiles, currentProfileId } = useSocialProfilesStore();

	return (
		<CommandGroup key="profiles" heading="Profiles">
			{profiles.map((profile) => (
				<CommandItem
					key={profile.id}
					value={profile.username}
					onSelect={() => {
						setOpen(false);
					}}
					className="text-sm"
				>
					<Avatar className="relative mr-2 h-7 w-7 !rounded-sm">
						<TwitterLogoIcon className="absolute bottom-0 right-0 m-px h-3 w-3 rounded-sm bg-blue-600 p-px text-white" />
						<AvatarImage
							src={profile.avatar}
							alt={profile.username}
							className="!rounded-sm bg-white"
						/>
						<AvatarFallback className="!rounded-sm border border-border">
							{profile.username?.[0]?.toUpperCase() ?? ""}
						</AvatarFallback>
					</Avatar>
					<span title={profile.username} className="overflow-hidden truncate">
						{profile.username}
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

type TeamSwitcherPopoverTriggerProps = PopoverTriggerProps & {
	open: boolean; // Define the 'open' prop
};

function SocialProfileSwitcherPopoverTrigger({
	className,
	open,
}: TeamSwitcherPopoverTriggerProps) {
	const { profiles, currentProfileId, setCurrentProfileId } =
		useSocialProfilesStore();

	const selectedProfile = profiles.find(
		(profile) => profile.id === currentProfileId,
	);

	if (!selectedProfile) {
		return null;
	}

	return (
		<PopoverTrigger>
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a profile"
				className={cn("w-[250px] justify-between", className)}
			>
				<Avatar className="relative mr-2 h-7 w-7 !rounded-sm">
					<TwitterLogoIcon className="absolute bottom-0 right-0 m-px h-3 w-3 rounded-sm bg-blue-600 p-px text-white" />
					<AvatarImage
						src={selectedProfile.avatar}
						alt={selectedProfile.username}
						className="!rounded-sm bg-white"
					/>
					<AvatarFallback className="!rounded-sm border border-border">
						{selectedProfile.username[0]?.toUpperCase() ?? ""}
					</AvatarFallback>
				</Avatar>
				<span
					title={selectedProfile.username}
					className="overflow-hidden truncate"
				>
					{selectedProfile.username}
				</span>
				<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>
	);
}

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

type SocialProfileSwitcherProps = PopoverTriggerProps;

export default function SocialProfileSwitcher({
	className,
}: SocialProfileSwitcherProps) {
	const [open, setOpen] = useState(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<SocialProfileSwitcherPopoverTrigger className={className} open={open} />
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
									setShowNewTeamDialog(true);
								}}
							>
								<PlusCircledIcon className="mr-2 h-5 w-5" />
								Add profile
							</CommandItem>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
