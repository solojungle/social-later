import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import { api } from "@/trpc/react";

export function DeleteAssetContent({
	selected,
	setShowDeleteDialog,
}: {
	selected: any[];
	setShowDeleteDialog: (show: boolean) => void;
}) {
	const [loading, setLoading] = useState(false);
	const utils = api.useUtils();

	const { mutateAsync: deleteAsset } = api.attachment.delete.useMutation({
		onSuccess() {
			utils.attachment.getAll.invalidate();
			toast.success("Successfully deleted the assets!", {});
		},
	});

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Are you sure you want to delete these assets?
				</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. All of your information will be lost.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<Button
					disabled={loading}
					variant="destructive"
					onClick={async () => {
						setLoading(true);
						try {
							await deleteAsset({
								attachmentIds: selected.map((asset) => asset.id),
							});
						} finally {
							setLoading(false);
							setShowDeleteDialog(false);
						}
					}}
				>
					{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Delete
				</Button>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
}
