import { MoreHorizontal, Trash2 } from "lucide-react";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

export function TableCellActions() {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button size="icon" variant="ghost">
						<span className="sr-only">Actions</span>
						<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onSelect={() => setShowDeleteDialog(true)}
						className="text-destructive"
					>
						<Trash2 className="mr-1 h-4 w-4" />
						<span>Delete invite</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This invitation will no longer be
							accessible to the recipient.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<Button
							variant="destructive"
							onClick={() => {
								setShowDeleteDialog(false);
								toast({
									description: "This invite has been deleted.",
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
