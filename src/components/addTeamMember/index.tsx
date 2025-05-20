"use client";

import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamMembersStore } from "@/stores/team-members";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { AddTeamMemberModal } from "./modal";

export function AddTeamMember() {
  const { members } = useTeamMembersStore();
  const { id: teamId } = useSelectedTeamStore();

  const hasTeam = !!teamId && teamId !== "";

  const displayedMembers = members.slice(0, 3);

  const avatarStack = displayedMembers.map((member) => (
    <Avatar className="pointer-events-none size-8 select-none" key={member.id}>
      <AvatarImage src={member.image} />
      <AvatarFallback className="border border-border">
        {member.name.split(" ").map((name: string) => name[0])}
      </AvatarFallback>
    </Avatar>
  ));

  return (
    <div className="flex items-center text-xs">
      <div className="mr-1 flex items-center -space-x-1 overflow-hidden">
        {avatarStack}
        {avatarStack.length > 2 && (
          <Avatar
            className="flex h-8 w-8 items-center justify-center bg-background"
            key={3}
          >
            <AvatarFallback className="border border-border text-xs font-medium">
              +{Math.min(members.length - avatarStack.length, 99)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger
            className={cn(!hasTeam && "cursor-not-allowed")}
            disabled={!hasTeam}
          >
            {/* TODO: Fix Tooltip hover bug */}
            <AddTeamMemberModal />
          </TooltipTrigger>
          <TooltipContent
            className="w-48"
            collisionPadding={{
              bottom: 15,
              left: 15,
              right: 15,
              top: 15,
            }}
            side="bottom"
          >
            {hasTeam && <p>Add team member</p>}
            {!hasTeam && (
              <p>
                You need to create a team first. Go to the team settings page to
                create a team.
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
