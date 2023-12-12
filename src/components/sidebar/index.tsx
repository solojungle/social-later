"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { buttonVariants } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	teamItems?: {
		href: string;
		title: string;
	}[];
	accountItems?: {
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
	const { image, imageFallbackInitials, name } = useUserStore();
	const {
		image: selectedTeamImage,
		name: selectedTeamName,
		imageFallbackInitials: selectedImageFallbackInitials,
	} = useSelectedTeamStore();

	const pathname = usePathname();

	return (
		<nav
			className={cn(
				"flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
				className,
			)}
			{...props}
		>
			{teamItems && (
				<div className="xs:mb-4 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
					<div className="xs:mb-2 flex items-center">
						<Avatar className="h-4 w-4">
							<AvatarImage src={selectedTeamImage} alt={selectedTeamName} />
							<AvatarFallback>{selectedImageFallbackInitials}</AvatarFallback>
						</Avatar>
						<h2 className="ml-3 text-xs font-medium uppercase text-muted-foreground">
							Team
						</h2>
					</div>
					{teamItems.map((item) => (
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
			)}
			<div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
				<div className="xs:mb-2 flex items-center">
					<Avatar className="h-4 w-4">
						<AvatarImage src={image} alt={name} />
						<AvatarFallback>{imageFallbackInitials}</AvatarFallback>
					</Avatar>
					<h2 className="ml-3 text-xs font-medium uppercase text-muted-foreground">
						Account
					</h2>
				</div>
				{accountItems &&
					accountItems?.length > 0 &&
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
