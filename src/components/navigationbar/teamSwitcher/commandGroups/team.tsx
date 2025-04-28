import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamStore } from "@/stores/teams";
import { CheckIcon } from "lucide-react";

type PersonalCommandGroupProps = {
  setOpen: (open: boolean) => void;
};

export default function TeamCommandGroup({
  setOpen,
}: PersonalCommandGroupProps) {
  const { name: selectedTeamName } = useSelectedTeamStore();

  // const pathName = usePathname();

  const { teams } = useTeamStore();

  // const { id } = useParams();

  // const router = useRouter();

  return (
    <CommandGroup heading="Teams" key="teams">
      {teams.map((team) => (
        <CommandItem
          className="text-sm"
          key={team.id}
          onSelect={() => {
            useSelectedTeamStore.setState({
              id: team.id,
              image: team.image,
              name: team.name,
              url: team.url,
            });

            setOpen(false);

            // router.push(
            // 	handleLinkClick({
            // 		selectedAccountType: selectedTeamType,
            // 		incomingAccountType: "team",
            // 		pathName,
            // 		teamUrl: team.url,
            // 		id,
            // 	}),
            // );
          }}
        >
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage alt={team.name} src={team.image} />
            <AvatarFallback>{team.name?.[0] ?? ""}</AvatarFallback>
          </Avatar>
          <span className="overflow-hidden truncate" title={team.name}>
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
