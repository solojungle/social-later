import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AddTeamMemberModal } from "./modal";

export function AddTeamMember() {
	const { image: userAvatar, name } = useUserStore();
	const { members } = useTeamMembersStore();

	const allMembers = [{ image: userAvatar, name, id: "0" }, ...members];
	const displayedMembers = allMembers.slice(0, 3);

	const avatarStack = displayedMembers.map((member) => (
		<Avatar
			key={member.id}
			className="pointer-events-none h-8 w-8 select-none bg-white"
		>
			<AvatarImage src={member.image} />
			<AvatarFallback className="border border-border">
				{member.name[0]}
			</AvatarFallback>
		</Avatar>
	));

	return (
		<div className="flex items-center text-xs">
			<div className="mr-1 flex items-center -space-x-1 overflow-hidden">
				{avatarStack}
				{avatarStack.length > 2 && (
					<Avatar
						key={3}
						className="flex h-8 w-8 items-center justify-center bg-white"
					>
						<AvatarFallback className="border border-border text-xs font-medium">
							+{Math.min(allMembers.length - avatarStack.length, 99)}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
			<Tooltip delayDuration={0}>
				<TooltipTrigger>
					{/* TODO: Fix Tooltip hover bug */}
					<AddTeamMemberModal />
				</TooltipTrigger>
				<TooltipContent side="bottom">
					<p>Add team member</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
}
