"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { InterfaceIcons } from "@/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";

const icons: { [key: string]: (props: { className?: string }) => JSX.Element } =
	{
		Nexus: (props) => <InterfaceIcons.Pages.Nexus {...props} />,
		Vault: (props) => <InterfaceIcons.Pages.Vault {...props} />,
		Settings: (props) => <InterfaceIcons.Settings {...props} />,
		Publish: (props) => <InterfaceIcons.Pages.Publish {...props} />,
		Analytics: (props) => <InterfaceIcons.Pages.Analytics {...props} />,
		Creator: (props) => <InterfaceIcons.Pages.Creator {...props} />,
	};

interface ItemProps {
	item: { path: string; name: string };
	isActive: boolean;
}

const Item = ({ item, isActive }: ItemProps) => {
	const Icon = icons[item.name];
	return (
		<TooltipProvider delayDuration={70}>
			<Link prefetch href={item.path}>
				<Tooltip>
					<TooltipTrigger className="w-full">
						<div
							key={item.path}
							id={item.path}
							className={cn(
								"flex size-11 items-center justify-center rounded-lg border border-transparent",
								"hover:border-[#DCDAD2] hover:bg-accent hover:dark:border-[#2C2C2C]",
								isActive &&
									"border-[#DCDAD2] bg-[#F2F1EF] dark:border-[#2C2C2C] dark:bg-secondary",
							)}
						>
							<div>
								<div className="flex items-center">
									{Icon && <Icon className="size-5" />}
									<span className="sr-only">{item.name}</span>
								</div>
							</div>
						</div>
					</TooltipTrigger>
					<TooltipContent
						side="left"
						className="hidden px-3 py-1.5 text-xs md:flex"
						sideOffset={10}
					>
						{item.name}
					</TooltipContent>
				</Tooltip>
			</Link>
		</TooltipProvider>
	);
};

export function MainMenu() {
	const { id: teamId } = useSelectedTeamStore();
	const { members } = useTeamMembersStore();
	const { id: userId } = useUserStore();

	const userRole = members.find((member) => member.id === userId)?.role;

	const defaultItems = [
		{ path: "/nexus", name: "Nexus" },
		{ path: "/publish", name: "Publish" },
		{ path: "/analytics", name: "Analytics" },
		{ path: "/vault", name: "Vault" },
		{ path: "/creator", name: "Creator" },
		{ path: `/teams/${teamId}/settings`, name: "Settings" },
	];

	const filteredItems = defaultItems.filter((item) => {
		if (item.name === "Settings") {
			return userRole === "OWNER" && teamId;
		}
		return true;
	});

	const pathname = usePathname();
	const part = pathname?.split("/")[1];

	return (
		<div className="mt-6">
			<nav>
				<div className="flex flex-col gap-1.5">
					{filteredItems.map((item) => {
						const isActive =
							(pathname === "/" && item.path === "/") ||
							(pathname !== "/" && item.path.startsWith(`/${part}`));

						return <Item key={item.path} item={item} isActive={isActive} />;
					})}
				</div>
			</nav>
		</div>
	);
}
