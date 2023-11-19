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

const groups = [
	{
		label: "Teams",
		teams: [
			{
				label: "Acme Inc.",
				value: "acme-inc",
			},
			{
				label: "Monsters Inc.",
				value: "monsters",
			},
		],
	},
];

type Team = (typeof groups)[number]["teams"][number];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
	const [open, setOpen] = React.useState(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

	const { avatar, avatarFallbackInitials, name } = useUserStore();

	const { teams, currentTeam } = useTeamStore();
	const selectedTeamData = teams.find((team) => team.id === currentTeam);

	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						aria-label="Select a team"
						className={cn("w-[200px] justify-between", className)}
					>
						<Avatar className="mr-2 h-5 w-5">
							<AvatarImage
								src={selectedTeamData?.avatar}
								alt={selectedTeamData?.name}
							/>
							<AvatarFallback>
								{selectedTeamData?.avatarFallbackInitials}
							</AvatarFallback>
						</Avatar>
						{selectedTeamData?.name}
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
											selectedTeamData?.name === name
												? "opacity-100"
												: "opacity-0",
										)}
									/>
								</CommandItem>
							</CommandGroup>

							{groups.map((group) => (
								<CommandGroup key={group.label} heading={group.label}>
									{group.teams.map((team) => (
										<CommandItem
											key={team.value}
											onSelect={() => {
												setOpen(false);
											}}
											className="text-sm"
										>
											<Avatar className="mr-2 h-5 w-5">
												<AvatarImage
													src={`https://avatar.vercel.sh/${team.value}.png`}
													alt={team.label}
												/>
												<AvatarFallback>SC</AvatarFallback>
											</Avatar>
											{team.label}
											<CheckIcon
												className={cn(
													"ml-auto h-4 w-4",
													selectedTeamData?.name === team.value
														? "opacity-100"
														: "opacity-0",
												)}
											/>
										</CommandItem>
									))}
								</CommandGroup>
							))}
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
