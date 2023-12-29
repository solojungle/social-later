"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamStore } from "@/stores/teams";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";

export function TeamDeleteCard() {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const router = useRouter();

	const { id: selectedTeamId } = useSelectedTeamStore();
	const user = useUserStore();
	const { removeTeam } = useTeamStore();

	const deleteTeam = api.team.delete.useMutation({
		onSuccess: () => {
			removeTeam(selectedTeamId);
			useSelectedTeamStore.setState(user);
			router.replace(`/settings`);
		},
	});

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

								deleteTeam.mutate({
									id: selectedTeamId,
								});

								toast.success("This team has been deleted.");
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
