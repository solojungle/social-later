import Link from "next/link";

import { cn } from "@/lib/utils";

export function TextLinks({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const pathname = "";

	return (
		<nav
			className={cn("flex items-center space-x-4 lg:space-x-6", className)}
			{...props}
		>
			<Link
				href="/"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.endsWith("/") ? "text-foreground" : "text-foreground/60",
				)}
			>
				Publish
			</Link>
			<Link
				href="/analytics"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.startsWith("/analytics")
						? "text-foreground"
						: "text-foreground/60",
				)}
			>
				Analytics
			</Link>
			<Link
				href="/engagement"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname?.startsWith("/engagement")
						? "text-foreground"
						: "text-foreground/60",
				)}
			>
				Engagement
			</Link>
			<Link
				href="/settings/account"
				className={cn(
					"transition-colors hover:text-foreground/80",
					pathname === "/settings/account"
						? "text-foreground"
						: "text-foreground/60",
				)}
			>
				Settings
			</Link>
		</nav>
	);
}
