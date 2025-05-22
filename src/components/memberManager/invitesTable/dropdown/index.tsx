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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InterfaceIcons } from "@/components/ui/icons";
import { useInvitationsStore } from "@/stores/invitations";
import { api } from "@/trpc/react";

interface TableCellActionsProps {
  invitationId: string;
  teamId: string;
}

export function TableCellActions({
  invitationId,
  teamId,
}: TableCellActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { removeInvitation } = useInvitationsStore();

  const deleteInvite = api.invitation.delete.useMutation({
    onSuccess(input) {
      removeInvitation(input.id);

      toast.success("This invite has been deleted.");
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <span className="sr-only">Actions</span>
            <InterfaceIcons.More className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <InterfaceIcons.Destructive className="mr-1 size-4" />
            <span>Delete invite</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
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
              onClick={() => {
                setShowDeleteDialog(false);

                deleteInvite.mutate({
                  invitationId,
                  teamId,
                });
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
