"use client";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { useState } from "react";

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
import { Checkout } from "./checkout";
import PersonalCommandGroup from "./commandGroups/personal";
import TeamCommandGroup from "./commandGroups/team";
import TeamSwitcherPopoverTrigger from "./trigger";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
	typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export default function TeamSwitcher({ className }: TeamSwitcherProps) {
	const [open, setOpen] = useState(false);
	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<Popover open={open} onOpenChange={setOpen}>
				<TeamSwitcherPopoverTrigger className={className} open={open} />
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandList>
							<CommandInput placeholder="Find team..." />
							<CommandEmpty>No team found.</CommandEmpty>
							<PersonalCommandGroup setOpen={setOpen} />
							<TeamCommandGroup setOpen={setOpen} />
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
				<Checkout setDialog={setShowNewTeamDialog} />
			</DialogContent>
		</Dialog>
	);
}
