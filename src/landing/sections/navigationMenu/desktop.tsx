import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DesktopMenu() {
	return (
		<div className="hidden space-x-4 md:flex">
			<Link
				href="/login"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"flex items-center justify-center",
				)}
			>
				<span>Login</span>
			</Link>
		</div>
	);
}
