import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { AddTeamMemberModal } from "./modal";

export function AddTeamMember() {
	const { image: userAvatar, name } = useUserStore();
	const { members } = useTeamMembersStore();

	const allMembers = [{ image: userAvatar, name }, ...members];
	const displayedMembers = allMembers.slice(0, 3);

	const memberAvatars = displayedMembers.map((member, index) => (
		// eslint-disable-next-line tailwindcss/classnames-order, prettier/prettier, react/no-array-index-key
		<Avatar key={index} className={`relative left-[${-10 * index}px] h-8 w-8 bg-white`}>
			<AvatarImage src={member.image} />
			<AvatarFallback className="border border-border">
				{member.name[0]}
			</AvatarFallback>
		</Avatar>
	));

	return (
		<div className="flex select-none items-center text-xs">
			<div className="mr-1 flex max-w-[98px] select-none items-center overflow-hidden">
				{memberAvatars}
				{memberAvatars.length > 2 && (
					<Avatar
						key={3}
						className="relative left-[-30px] mr-[-10px] flex h-8 w-8 items-center justify-center bg-white"
					>
						<AvatarFallback className="border border-border text-xs font-medium">
							+{allMembers.length}
						</AvatarFallback>
					</Avatar>
				)}
			</div>
			<Tooltip delayDuration={500}>
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
