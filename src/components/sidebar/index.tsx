"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useTeamStore } from "@/stores/teams";
import { useUserStore } from "@/stores/user";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	teamItems: {
		href: string;
		title: string;
	}[];
	accountItems: {
		href: string;
		title: string;
	}[];
}

export function Sidebar({
	className,
	teamItems,
	accountItems,
	...props
}: SidebarNavProps) {
	const { avatar, avatarFallbackInitials, name } = useUserStore();
	const { teams, currentTeam } = useTeamStore();

	const currentTeamData = teams.find((team) => team.id === currentTeam);

	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className,
			)}
			{...props}
		>
			<div className="mb-4 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
				<div className="mb-2 flex items-center">
					<Avatar className="h-4 w-4">
						<AvatarImage
							src={currentTeamData?.avatar}
							alt={currentTeamData?.name}
						/>
						<AvatarFallback>
							{currentTeamData?.avatarFallbackInitials}
						</AvatarFallback>
					</Avatar>
					<h2 className="ml-3 text-xs font-medium uppercase text-muted-foreground">
						Team
					</h2>
				</div>
				{teamItems?.length > 0 &&
					teamItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								pathname === item.href
									? "bg-muted hover:bg-muted"
									: "font-normal hover:bg-transparent hover:underline",
								"justify-start",
							)}
						>
							{item.title}
						</Link>
					))}
			</div>
			<div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
				<div className="mb-2 flex items-center">
					<Avatar className="h-4 w-4">
						<AvatarImage src={avatar} alt={name} />
						<AvatarFallback>{avatarFallbackInitials}</AvatarFallback>
					</Avatar>
					<h2 className="ml-3 text-xs font-medium uppercase text-muted-foreground">
						Account
					</h2>
				</div>
				{accountItems?.length > 0 &&
					accountItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								buttonVariants({ variant: "ghost" }),
								pathname === item.href
									? "bg-muted hover:bg-muted"
									: "font-normal hover:bg-transparent hover:underline",
								"justify-start",
							)}
						>
							{item.title}
						</Link>
					))}
			</div>
		</nav>
	);
}
