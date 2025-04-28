"use client";

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
import { InterfaceIcons } from "@/components/ui/icons";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";
import { useState } from "react";
import { toast } from "sonner";

export function RemoveUserAlertDialog({ member, onOpenChange, open }: any) {
  const { id: teamId } = useSelectedTeamStore();
  const [loading, setLoading] = useState(false);
  const utils = api.useUtils();

  const { mutateAsync: removeUser } = api.team.removeMember.useMutation({
    onError: () => {
      toast.error("Failed to remove user");
    },
    onSettled: () => {
      setLoading(false);
      onOpenChange(false);
    },
    onSuccess: () => {
      toast.success("Successfully removed user from team");
      utils.team.getMembers.invalidate();
    },
  });

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove the selected user from your team
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure that you want to remove <b>{member.email}</b> from your
            team?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </AlertDialogCancel>
          <Button
            disabled={loading}
            onClick={() => {
              setLoading(true);
              removeUser({
                teamId,
                userId: member.id,
              });
            }}
            type="submit"
            variant="destructive"
          >
            {loading && (
              <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Remove
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
