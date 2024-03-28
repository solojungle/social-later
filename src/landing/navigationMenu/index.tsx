"use client";

import { ArrowUpRight, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NavigationMenu() {
	const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen); // Toggle menu state
	};

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
			{/* Hamburger Menu */}
			<div className="flex space-x-4 md:hidden">
				<Button
					type="button"
					variant="default"
					size="icon"
					aria-label="Toggle Menu"
					onClick={toggleMenu} // Toggle menu on click
				>
					{isMenuOpen ? (
						<XIcon className="h-6 w-6" /> // Show close icon when menu is open
					) : (
						<MenuIcon className="h-6 w-6" /> // Show hamburger icon otherwise
					)}
				</Button>
			</div>
			{/* Desktop Menu */}
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
				<Button variant="default">
					Start a free trial <ArrowUpRight className="ml-1 h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
