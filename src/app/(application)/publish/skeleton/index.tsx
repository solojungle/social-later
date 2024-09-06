// Will show "Add Social Profile" button, a "Connect Social Profile" and a description on top
// There will be a blur effect on the background

import { ChevronLeft, ChevronRight } from "lucide-react";

import AddSocialProfile from "@/components/addSocialProfileButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function DaySkeleton() {
	return (
		<Skeleton
			className={cn("h-full animate-none bg-background py-2 text-foreground")}
		/>
	);
}

// And the background will be a skeleton of a calendar
function CalendarSkeleton({ isEmpty = true }: { isEmpty?: boolean }) {
	return (
		<div
			className={cn(
				"flex h-screen flex-col p-3",
				isEmpty && "pointer-events-none opacity-20 blur-[3px]",
			)}
		>
			<div className="flex items-center space-x-4 rounded-t border border-b-0 p-2">
				<Button variant="ghost">
					<ChevronLeft className="h-5 w-5" />
				</Button>
				<span className="flex w-36 justify-center font-semibold">
					{new Date().toLocaleString("default", {
						month: "long",
					})}
				</span>
				<Button variant="ghost">
					<ChevronRight className="h-5 w-5" />
				</Button>
			</div>
			<div className="flex flex-auto flex-col pb-24">
				<div className="grid grid-cols-7 gap-px bg-border p-px pb-0 text-center text-xs font-semibold leading-6">
					{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
						<div key={day} className="bg-background py-2 text-foreground">
							{day.charAt(0)}
							<span>{day.slice(1)}</span>
						</div>
					))}
				</div>
				<div className="flex flex-auto bg-border text-xs leading-6 text-foreground">
					<div className="grid w-full grid-cols-7 grid-rows-5 gap-px border">
						{Array.from({ length: 35 }, (_, i) => (
							<DaySkeleton key={i} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
function Dialogue() {
	return (
		<div className="absolute left-0 top-0 z-20 flex h-[calc(100vh-300px)] w-full items-center justify-center">
			<div className="mx-auto flex max-w-sm flex-col items-center justify-center text-center">
				<h2 className="mb-2 text-xl font-medium">
					Connect social media profile
				</h2>
				<p className="mb-6 text-sm text-[#878787]">
					Unlock powerful social media management features. Easily schedule
					posts, analyze engagement metrics, and manage multiple platforms.
				</p>

				<AddSocialProfile />
			</div>
		</div>
	);
}

export function PublishPageSkeleton() {
	// Add a blur effect to the background
	return (
		<div className="relative h-[calc(100vh-200px)] overflow-hidden">
			<Dialogue />
			<CalendarSkeleton />
		</div>
	);
}
