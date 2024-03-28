"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationMenu() {
	return (
		<div className="flex h-16 w-full max-w-7xl items-center justify-between px-4 py-2">
			<div className="flex items-center">
				<a href="https://feedfrenzy.co/" className="flex">
					<img
						alt="feedfrenzy logo"
						src="/images/logo.png"
						className="mr-3 h-8 w-8 rounded-sm"
					/>
					<span className="self-center whitespace-nowrap text-base font-semibold dark:text-white">
						feedfrenzy.co
					</span>
				</a>
			</div>
			<div className="flex space-x-4">
				<Link
					href="/login"
					className={cn(
						buttonVariants({ variant: "ghost" }),
						"flex items-center justify-center",
					)}
				>
					<span>Login</span>
				</Link>
				<Button variant="outline">
					Start a free trial <ArrowUpRight className="ml-1 h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
