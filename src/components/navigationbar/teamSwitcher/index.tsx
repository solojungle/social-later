"use client";

import {
	CaretSortIcon,
	CheckIcon,
	PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useParams, usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTeamStore } from "@/stores/teams";
import { useUserStore } from "@/stores/user";

import { Button } from "../../ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "../../ui/command";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import TeamSwitcherModal from "./modal";
import { handleLinkClick } from "./utils";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
	const [open, setOpen] = React.useState(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

	const { image, imageFallbackInitials, name, type } = useUserStore();
	const { teams, selectedTeam, updateSelectedTeam } = useTeamStore();

	// Faciliate keeping the current URL when switching businesses
	const router = useRouter();
	const { id } = useParams();
	const pathName = usePathname();

	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a team"
						className={cn(
							"w-[200px] justify-between overflow-hidden truncate",
							className,
						)}
					>
						<Avatar className="mr-2 h-5 w-5">
							<AvatarImage src={selectedTeam.image} alt={selectedTeam.name} />
							<AvatarFallback>
								{selectedTeam?.imageFallbackInitials}
							</AvatarFallback>
						</Avatar>
						{selectedTeam?.name}
						<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Find team..." />
							<CommandEmpty>No team found.</CommandEmpty>
							<CommandGroup key="personal" heading="Personal Account">
								<CommandItem
									key={name}
									onSelect={() => {
										updateSelectedTeam({
											id: "",
											name,
											image,
											url: "",
											type,
											imageFallbackInitials,
										});
										setOpen(false);

										if (selectedTeam.type !== "personal") {
											router.push(
												handleLinkClick({
													selectedAccountType: selectedTeam.type,
													incomingAccountType: "personal",
													pathName,
													teamUrl: "",
													id,
												}),
											);
										}
									}}
									className="text-sm"
								>
									<Avatar className="mr-2 h-5 w-5">
										<AvatarImage src={image} alt={name} />
										<AvatarFallback>{imageFallbackInitials}</AvatarFallback>
									</Avatar>
									{name}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											selectedTeam?.name === name ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
							</CommandGroup>
							<CommandGroup key="teams" heading="Teams">
								{teams.map((team) => (
									<CommandItem
										key={team.id}
										onSelect={() => {
											updateSelectedTeam({
												id: team.id,
												name: team.name,
												url: team.url,
												type: team.type,
												image: team.image,
												imageFallbackInitials: team.imageFallbackInitials,
											});

											setOpen(false);
											router.push(
												handleLinkClick({
													selectedAccountType: selectedTeam.type,
													incomingAccountType: "team",
													pathName,
													teamUrl: team.url,
													id,
												}),
											);
										}}
										className="text-sm"
									>
										<Avatar className="mr-2 h-5 w-5">
											<AvatarImage src={team.image} alt={team.name} />
											<AvatarFallback>
												{team.imageFallbackInitials}
											</AvatarFallback>
										</Avatar>
										{team.name}
										<CheckIcon
											className={cn(
												"ml-auto h-4 w-4",
												selectedTeam?.name === team.name
													? "opacity-100"
													: "opacity-0",
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
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
										Create Team
									</CommandItem>
								</DialogTrigger>
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create team</DialogTitle>
					<DialogDescription>
						Add a new team to manage products and customers.
					</DialogDescription>
				</DialogHeader>
				<TeamSwitcherModal setShowNewTeamDialog={setShowNewTeamDialog} />
			</DialogContent>
		</Dialog>
	);
}
