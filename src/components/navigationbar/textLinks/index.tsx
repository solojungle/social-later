"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useSelectedTeamStore } from "@/stores/selected-team";

export function TextLinks({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const { url } = useSelectedTeamStore();
	const pathname = usePathname();
	const settingsUrl = `/teams/${url}/settings`;

	return (
		<nav
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}
		>
			<Link
				href="/publish"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.endsWith("/") ? "text-foreground" : "text-foreground/60",
				)}
			>
				Publish
			</Link>
			{/* <Link
				href="/analytics"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.startsWith("/analytics")
						? "text-foreground"
						: "text-foreground/60",
				)}
			>
				Analytics
			</Link> */}
			{/* Reducing scope for now */}
			{/* <Link
				href="/engagement"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.startsWith("/engagement")
						? "text-foreground"
						: "text-foreground/60",
				)}
			>
				Engagement
			</Link> */}
			<Link
				href={settingsUrl}
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.startsWith(settingsUrl)
						? "text-foreground"
						: "text-foreground/60",
				)}
			>
				Settings
			</Link>
		</nav>
	);
}
