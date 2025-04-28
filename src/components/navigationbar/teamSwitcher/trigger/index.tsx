import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { PopoverTriggerProps } from "@radix-ui/react-popover";

type TeamSwitcherPopoverTriggerProps = {
  open: boolean; // Define the 'open' prop
} & PopoverTriggerProps;

export default function TeamSwitcherPopoverTrigger({
  className,
  open,
}: TeamSwitcherPopoverTriggerProps) {
  const { image: selectedTeamImage, name: selectedTeamName } =
    useSelectedTeamStore();

  return (
    <PopoverTrigger asChild>
      <Button
        aria-expanded={open}
        aria-label="Select a team"
        className={cn("w-[200px] justify-between", className)}
        role="combobox"
        variant="outline"
      >
        <Avatar className="mr-2 h-5 w-5">
          <AvatarImage alt={selectedTeamName} src={selectedTeamImage} />
          <AvatarFallback>{selectedTeamName?.[0] ?? ""}</AvatarFallback>
        </Avatar>
        <span className="overflow-hidden truncate" title={selectedTeamName}>
          {selectedTeamName}
        </span>
        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}
