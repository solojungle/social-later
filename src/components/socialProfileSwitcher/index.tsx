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
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useSocialProfilesStore } from "@/stores/social-profiles";
import { useTeamStore } from "@/stores/teams";

import { Checkout } from "../navigationbar/teamSwitcher/checkout";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type PersonalCommandGroupProps = {
	setOpen: (open: boolean) => void;
};

function SocialProfilesCommandGroup({ setOpen }: PersonalCommandGroupProps) {
	const { name: selectedTeamName } = useSelectedTeamStore();
	const { teams } = useTeamStore();

	return (
		<CommandGroup key="teams" heading="Profiles">
			{teams.map((team) => (
				<CommandItem
					key={team.id}
					onSelect={() => {
						useSelectedTeamStore.setState({
							id: team.id,
							name: team.name,
							url: team.url,
							image: team.image,
						});
						setOpen(false);
					}}
					className="text-sm"
				>
					<Avatar className="mr-2 h-5 w-5">
						<AvatarImage src={team.image} alt={team.name} />
						<AvatarFallback>{team.name?.[0] ?? ""}</AvatarFallback>
					</Avatar>
					<span title={team.name} className="overflow-hidden truncate">
						{team.name}
					</span>
					<CheckIcon
						className={cn(
							"ml-auto h-4 w-4",
							selectedTeamName === team.name ? "opacity-100" : "opacity-0",
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

function TeamSwitcherPopoverTrigger({
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
		<PopoverTrigger asChild>
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a team"
				className={cn("w-[250px] justify-between", className)}
			>
				<Avatar className="relative mr-2 h-7 w-7 !rounded-sm bg-white shadow-sm">
					<TwitterLogoIcon className="absolute bottom-0 right-0 m-px h-3 w-3 rounded-sm bg-blue-600 p-px text-white" />
					<AvatarImage
						src={selectedProfile.avatar}
						alt={selectedProfile.username}
						className="!rounded-sm"
					/>
					<AvatarFallback className="!rounded-sm">
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
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<TeamSwitcherPopoverTrigger className={className} open={open} />
				<PopoverContent className="w-[250px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Search profiles..." />
							<CommandEmpty>No profiles found.</CommandEmpty>
							<SocialProfilesCommandGroup setOpen={setOpen} />
						</CommandList>
						<CommandList>
							<CommandGroup>
								<DialogTrigger asChild>
									<CommandItem
										onSelect={() => {
											setOpen(false);
											setShowNewTeamDialog(true);
										}}
									>
										<PlusCircledIcon className="mr-2 h-5 w-5" />
										Add profile
									</CommandItem>
								</DialogTrigger>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>INSERT PROFILE HERE</DialogTitle>
					<DialogDescription>
						Add a new team to manage products and customers.
					</DialogDescription>
				</DialogHeader>
				<Checkout />
			</DialogContent>
		</Dialog>
	);
}
