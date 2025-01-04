import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DesktopMenu() {
	return (
		<div className="hidden space-x-4 md:flex">
			<Link
				href="/login"
				className={cn(
					buttonVariants({ variant: "link" }),
					"flex items-center justify-center text-base",
				)}
			>
				<span className="text-black">Login</span>
			</Link>
		</div>
	);
}
