"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import { RemoveUserAlertDialog } from "./removeUser";
import { UpdateRoleDialog } from "./updateRole";

export function MembersTable() {
  const { email: userEmail } = useUserStore();
  const { members } = useTeamMembersStore();

  return (
    <Table className="w-full">
      <div className="flex w-full items-center justify-between rounded-lg border bg-muted px-4 py-2 pr-5">
        <div className="flex items-center">
          <Checkbox className="mr-4" />
          <span className="text-muted-foreground">Select all</span>
        </div>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <TableBody>
        {members.map((t) => {
          return (
            <TableRow key={t.email}>
              <TableCell className="rounded-lg">
                <div className="flex items-center justify-between pr-5">
                  <div className="flex items-center">
                    <Checkbox
                      className="ml-2 mr-4"
                      disabled={t.email === userEmail}
                    />
                    <Avatar className="mr-4 h-8 w-8">
                      <AvatarImage alt="label" src={t.image} />
                      <AvatarFallback>
                        {t.name.split(" ").map((name: string) => name[0])}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{t.name}</span>
                      <span className="w-28 truncate font-normal lowercase text-muted-foreground sm:w-full">
                        {t.email}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-6 text-xs capitalize text-muted-foreground">
                      {t.role}
                    </span>
                    <OptionsMenu
                      isDisabled={t.email === userEmail}
                      member={t}
                    />
                  </div>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function OptionsMenu({
  isDisabled,
  member,
}: {
  isDisabled: boolean;
  member: any;
}) {
  const [showChangeRole, setShowChangeRole] = useState(false);
  const [showRemoveUser, setShowRemoveUser] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isDisabled}>
        <Button size="icon" variant="outline">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={isDisabled}
          onClick={() => setShowChangeRole(true)}
        >
          Change role
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive"
          disabled={isDisabled}
          onClick={() => setShowRemoveUser(true)}
        >
          Remove user
        </DropdownMenuItem>
      </DropdownMenuContent>
      <RemoveUserAlertDialog
        member={member}
        onOpenChange={setShowRemoveUser}
        open={showRemoveUser}
      />
      <UpdateRoleDialog
        member={member}
        onOpenChange={setShowChangeRole}
        open={showChangeRole}
      />
    </DropdownMenu>
  );
}
