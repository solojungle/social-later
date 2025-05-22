"use client";

import { Mail } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InterfaceIcons } from "@/components/ui/icons";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useInvitationsStore } from "@/stores/invitations";
import { useSelectedTeamStore } from "@/stores/selected-team";

import { TableCellActions } from "./dropdown";

export function InvitesTable() {
  const { invitations } = useInvitationsStore();

  const { id: selectedTeamId } = useSelectedTeamStore();

  return (
    <Table className="w-full">
      <div className="flex w-full items-center justify-between rounded-lg border bg-muted px-4 py-2 pr-5">
        <div className="flex items-center">
          <Checkbox className="mr-4" disabled={invitations.length === 0} />
          <span className="text-muted-foreground">Select all</span>
        </div>
        <Button size="icon" variant="ghost">
          <InterfaceIcons.More className="size-4 text-muted-foreground" />
        </Button>
      </div>
      {invitations.length === 0 ? (
        <TableBody>
          <TableRow>
            <p className="py-4 text-center text-muted-foreground">
              No pending invitations.
            </p>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {invitations.map((t) => {
            return (
              <TableRow key={t.email}>
                <TableCell className="rounded-lg">
                  <div className="flex items-center justify-between pr-5">
                    <div className="flex items-center">
                      <Checkbox className="ml-2 mr-4" />
                      <Avatar className="mr-4 size-8">
                        <AvatarFallback>
                          {t.email.split(" ").map((name: string) => name[0])}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <span className="mr-2 font-medium">Pending</span>
                          <Mail className="size-4 text-muted-foreground" />
                        </div>
                        <span className="w-28 truncate font-normal text-muted-foreground sm:w-full">
                          {t.email.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-6 capitalize text-muted-foreground">
                        {t.role}
                      </span>
                      <TableCellActions
                        invitationId={t.id}
                        teamId={selectedTeamId}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      )}
    </Table>
  );
}
