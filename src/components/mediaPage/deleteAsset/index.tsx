import { toast } from "sonner";

import {
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteAssetContent() {
	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Are you sure you want to delete your team?
				</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. All of your information will be lost.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<Button
					variant="destructive"
					onClick={() => {
						// setShowDeleteDialog(false);

						// deleteTeam.mutate({
						// 	id: selectedTeamId,
						// });

						toast.success("This team has been deleted.");
					}}
				>
					Delete
				</Button>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
