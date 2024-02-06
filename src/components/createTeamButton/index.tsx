"use client";

import { useState } from "react";

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

export default function CreateTeamButton() {
	const [showNewTeamDialog, setShowNewTeamDialog] = useState(false);

	return (
		<Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
			<DialogTrigger asChild>
				<Button>Create new team</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create team</DialogTitle>
					<DialogDescription>
						Add a new team to manage products and customers.
					</DialogDescription>
				</DialogHeader>
				<Checkout />
			</DialogContent>
		</Dialog>
	);
}
