import { CaretSortIcon } from "@radix-ui/react-icons";
import { PopoverTriggerProps } from "@radix-ui/react-popover";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";

type TeamSwitcherPopoverTriggerProps = PopoverTriggerProps & {
	open: boolean; // Define the 'open' prop
};

export default function TeamSwitcherPopoverTrigger({
	className,
	open,
}: TeamSwitcherPopoverTriggerProps) {
	const { name: selectedTeamName, image: selectedTeamImage } =
		useSelectedTeamStore();

	return (
		<PopoverTrigger asChild>
			<Button
				variant="outline"
				role="combobox"
				aria-expanded={open}
				aria-label="Select a team"
				className={cn("w-[200px] justify-between", className)}
			>
				<Avatar className="mr-2 h-5 w-5">
					<AvatarImage src={selectedTeamImage} alt={selectedTeamName} />
					<AvatarFallback>{selectedTeamName?.[0] ?? ""}</AvatarFallback>
				</Avatar>
				<span title={selectedTeamName} className="overflow-hidden truncate">
					{selectedTeamName}
				</span>
				<CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
			</Button>
		</PopoverTrigger>
	);
}
