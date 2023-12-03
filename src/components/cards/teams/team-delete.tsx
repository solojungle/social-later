"use client";

import { useState } from "react";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

export function TeamDeleteCard() {
	const [open, setIsOpen] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const updateTeam = api.team.update.useMutation();

	return (
		<>
			<Card className="border border-destructive">
				<CardHeader>
					<CardTitle className="mb-2">Delete Team</CardTitle>
					<CardDescription className="text-black">
						Delete your access to this Team. Any resources you&apos;ve added to
						the Team will be destroyed.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex items-center justify-between" />
				<div className="rounded-b-xl bg-red-100">
					<Separator className="my-2 bg-destructive" />
					<CardFooter className="flex justify-end pb-2">
						<Button
							onClick={() => setShowDeleteDialog(true)}
							variant="destructive"
						>
							Delete Team
						</Button>
					</CardFooter>
				</div>
			</Card>
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete your team?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. All of your information will be
							lost.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button
							variant="destructive"
							onClick={() => {
								setShowDeleteDialog(false);

								toast({
									description: "This team has been deleted.",
								});
							}}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
