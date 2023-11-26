import { CheckIcon } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";

import { handleLinkClick } from "../utils";

type PersonalCommandGroupProps = {
	setOpen: (open: boolean) => void;
};

export default function PersonalCommandGroup({
	setOpen,
}: PersonalCommandGroupProps) {
	const { image, imageFallbackInitials, name, type } = useUserStore();

	const { type: teamType, name: selectedTeamName } = useSelectedTeamStore();

	const pathName = usePathname();

	const { id } = useParams();

	const router = useRouter();

	return (
		<CommandGroup key="personal" heading="Personal Account">
			<CommandItem
				key={name}
				onSelect={() => {
					useSelectedTeamStore.setState({
						id: "",
						name,
						image,
						url: "",
						type,
						imageFallbackInitials,
					});

					setOpen(false);

					if (teamType !== "personal") {
						router.push(
							handleLinkClick({
								selectedAccountType: teamType,
								incomingAccountType: "personal",
								pathName,
								teamUrl: "",
								id,
							}),
						);
					}
				}}
				className="text-sm"
			>
				<Avatar className="mr-2 h-5 w-5">
					<AvatarImage src={image} alt={name} />
					<AvatarFallback>{imageFallbackInitials}</AvatarFallback>
				</Avatar>
				{name}
				<CheckIcon
					className={cn(
						"ml-auto h-4 w-4",
						selectedTeamName === name ? "opacity-100" : "opacity-0",
					)}
				/>
			</CommandItem>
		</CommandGroup>
	);
}
