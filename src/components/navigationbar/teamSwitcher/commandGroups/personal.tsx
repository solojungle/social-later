import { Button } from "@/components/ui/button";
import { CommandGroup } from "@/components/ui/command";

type PersonalCommandGroupProps = {
	setOpen: (open: boolean) => void;
};

export default function PersonalCommandGroup({
	setOpen,
}: PersonalCommandGroupProps) {
	// const { image, name } = useUserStore();

	// const { name: selectedTeamName } = useSelectedTeamStore();

	// const pathName = usePathname();

	// const { id } = useParams();

	// const router = useRouter();

	return (
		<CommandGroup key="personal" heading="Personal Account">
			<Button
				onClick={() => {
					setOpen(false);
				}}
			/>
			{/* <CommandItem
				key={name}
				onSelect={() => {
					useSelectedTeamStore.setState({
						id: "",
						name,
						image,
						url: "",
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
					<AvatarFallback>{name?.[0] ?? ""}</AvatarFallback>
				</Avatar>
				{name}
				<CheckIcon
					className={cn(
						"ml-auto h-4 w-4",
						selectedTeamName === name ? "opacity-100" : "opacity-0",
					)}
				/>
			</CommandItem> */}
		</CommandGroup>
	);
}
