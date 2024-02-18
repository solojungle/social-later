"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationMenu() {
	return (
		<div className="fixed flex h-20 w-full items-center justify-between bg-black/70 px-8 py-1 backdrop-blur-md">
			<div className="flex items-center">
				<a href="https://aliawari.com/">
					<span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
						aliawari.com
					</span>
				</a>
			</div>
			<Link
				href="/login"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"flex items-center justify-center",
				)}
			>
				<span>Login</span>
				<ChevronRight className="ml-2 h-5 w-5" />
			</Link>
		</div>
	);
}
