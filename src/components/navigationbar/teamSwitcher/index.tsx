"use client";

import {
	CaretSortIcon,
	CheckIcon,
	PlusCircledIcon,
} from "@radix-ui/react-icons";
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
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
	const [open, setOpen] = React.useState(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

	const { avatar, avatarFallbackInitials, name } = useUserStore();

	const { teams, selectedTeam } = useTeamStore();

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
							<AvatarImage
								src={selectedTeam?.avatar}
								alt={selectedTeam?.name}
							/>
							<AvatarFallback>
								{selectedTeam?.avatarFallbackInitials}
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
										setOpen(false);
									}}
									className="text-sm"
								>
									<Avatar className="mr-2 h-5 w-5">
										<AvatarImage src={avatar} alt={name} />
										<AvatarFallback>{avatarFallbackInitials}</AvatarFallback>
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
											setOpen(false);
										}}
										className="text-sm"
									>
										<Avatar className="mr-2 h-5 w-5">
											<AvatarImage src={team.avatar} alt={team.name} />
											<AvatarFallback>
												{team.avatarFallbackInitials}
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
				<div>
					<div className="space-y-4 py-2 pb-4">
						<div className="space-y-2">
							<Label htmlFor="name">Team name</Label>
							<Input id="name" placeholder="Acme Inc." />
						</div>
						<div className="space-y-2">
							<Label htmlFor="plan">Subscription plan</Label>
							<Select>
								<SelectTrigger>
									<SelectValue placeholder="Select a plan" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="free">
										<span className="font-medium">Free</span> -{" "}
										<span className="text-muted-foreground">
											Trial for two weeks
										</span>
									</SelectItem>
									<SelectItem value="pro">
										<span className="font-medium">Pro</span> -{" "}
										<span className="text-muted-foreground">
											$9/month per user
										</span>
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
						Cancel
					</Button>
					<Button type="submit">Continue</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
