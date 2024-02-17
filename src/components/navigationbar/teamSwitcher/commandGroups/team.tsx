import { CheckIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamStore } from "@/stores/teams";

import { handleLinkClick } from "../utils";

type PersonalCommandGroupProps = {
	setOpen: (open: boolean) => void;
};

export default function TeamCommandGroup({
	setOpen,
}: PersonalCommandGroupProps) {
	const { type: selectedTeamType, name: selectedTeamName } =
		useSelectedTeamStore();

	const pathName = usePathname();

	const { teams } = useTeamStore();

	const { id } = useParams();

	const router = useRouter();

	return (
		<CommandGroup key="teams" heading="Teams">
			{teams.map((team) => (
				<CommandItem
					key={team.id}
					onSelect={() => {
						useSelectedTeamStore.setState({
							id: team.id,
							name: team.name,
							url: team.url,
							image: team.image,
						});

						setOpen(false);

						router.push(
							handleLinkClick({
								selectedAccountType: selectedTeamType,
								incomingAccountType: "team",
								pathName,
								teamUrl: team.url,
								id,
							}),
						);
					}}
					className="text-sm"
				>
					<Avatar className="mr-2 h-5 w-5">
						<AvatarImage src={team.image} alt={team.name} />
						<AvatarFallback>{team.name?.[0] ?? ""}</AvatarFallback>
					</Avatar>
					<span title={team.name} className="overflow-hidden truncate">
						{team.name}
					</span>
					<CheckIcon
						className={cn(
							"ml-auto h-4 w-4",
							selectedTeamName === team.name ? "opacity-100" : "opacity-0",
						)}
					/>
				</CommandItem>
			))}
		</CommandGroup>
	);
}
