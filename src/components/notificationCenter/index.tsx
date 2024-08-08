"use client";

// import { useNotifications } from "@/hooks/use-notifications";

import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useNotifications } from "@/hooks/use-notifications";

import { NotificationButton } from "../navigationbar/notificationButton";
import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

function EmptyState({ description }) {
	return (
		<div className="flex h-[460px] flex-col items-center justify-center space-y-4">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
				<InterfaceIcons.Archive className="h-4 w-4 shrink-0" />
			</div>
			<p className="text-sm text-[#606060]">{description}</p>
		</div>
	);
}

function NotificationItem({
	id,
	setOpen,
	description,
	createdAt,
	recordId,
	from,
	to,
	markMessageAsRead,
	type,
}: any) {
	switch (type) {
		case "inbox":
			return (
				<div className="flex items-center justify-between space-x-4 p-3 hover:bg-secondary">
					<Link
						className="flex items-center justify-between space-x-4 "
						onClick={() => setOpen(false)}
						href={`/inbox?id=${recordId}`}
					>
						<div>
							<div className="flex h-9 w-9 items-center justify-center space-y-0 rounded-full border">
								<InterfaceIcons.Email className="h-4 w-4 shrink-0" />
							</div>
						</div>
						<div>
							<p className="text-sm">{description}</p>
							<span className="text-xs text-[#606060]">
								{formatDistanceToNow(new Date(createdAt))} ago
							</span>
						</div>
					</Link>
					{markMessageAsRead && (
						<div>
							<Button
								size="icon"
								variant="secondary"
								className="rounded-full bg-transparent hover:bg-[#1A1A1A]"
								onClick={() => markMessageAsRead(id)}
							>
								<InterfaceIcons.Archive />
							</Button>
						</div>
					)}
				</div>
			);

		default:
			return null;
	}
}

export function NotificationCenter() {
	const [isOpen, setOpen] = useState(false);
	const {
		hasUnseenNotifications,
		notifications,
		markMessageAsRead,
		markAllMessagesAsSeen,
		markAllMessagesAsRead,
	} = useNotifications();

	const unreadNotifications = notifications.filter(
		(notification) => !notification.read,
	);

	const archivedNotifications = notifications.filter(
		(notification) => notification.read,
	);

	useEffect(() => {
		if (isOpen && hasUnseenNotifications) {
			markAllMessagesAsSeen();
		}
	}, [hasUnseenNotifications, isOpen, markAllMessagesAsSeen]);

	return (
		<Popover onOpenChange={setOpen} open={isOpen}>
			<PopoverTrigger asChild>
				<NotificationButton showDot={hasUnseenNotifications} />
			</PopoverTrigger>
			<PopoverContent
				className="relative mr-7 h-[535px] w-screen overflow-hidden p-0 md:w-[400px]"
				sideOffset={10}
			>
				<Tabs defaultValue="inbox">
					<TabsList className="w-full justify-start rounded-none border-b-[1px] bg-transparent py-6">
						<TabsTrigger
							value="inbox"
							className="font-normal !shadow-none [&>div]:data-[state=active]:bg-foreground [&>div]:data-[state=active]:text-background"
						>
							<span className="mr-2">Inbox</span>
							<div className="rounded-sm bg-muted px-1 py-px text-xs text-muted-foreground transition-colors duration-200">
								99+
							</div>
						</TabsTrigger>
						<TabsTrigger value="archive" className="font-normal !shadow-none">
							Archive
						</TabsTrigger>
					</TabsList>

					<Link
						href="/settings/notifications"
						className="absolute right-[11px] top-1.5"
					>
						<Button
							variant="secondary"
							size="icon"
							className="rounded-full bg-transparent hover:bg-accent"
							onClick={() => setOpen(false)}
						>
							<InterfaceIcons.Settings className="h-4 w-4 shrink-0" />
						</Button>
					</Link>

					<TabsContent value="inbox" className="relative mt-0">
						{!unreadNotifications.length && (
							<EmptyState description="No new notifications" />
						)}

						{unreadNotifications.length > 0 && (
							<ScrollArea className="h-[485px] pb-12">
								<div className="divide-y">
									{unreadNotifications.map((notification) => {
										return (
											<NotificationItem
												key={notification.id}
												id={notification.id}
												markMessageAsRead={markMessageAsRead}
												setOpen={setOpen}
												description={notification.payload.description}
												createdAt={notification.createdAt}
												recordId={notification.payload.recordId}
												type={notification.payload.type}
												from={notification.payload?.from}
												to={notification.payload?.to}
											/>
										);
									})}
								</div>
							</ScrollArea>
						)}

						{unreadNotifications.length > 0 && (
							<div className="absolute bottom-0 flex h-12 w-full items-center justify-center border-t-[1px]">
								<Button
									variant="secondary"
									className="bg-transparent"
									onClick={markAllMessagesAsRead}
								>
									Archive all
								</Button>
							</div>
						)}
					</TabsContent>

					<TabsContent value="archive" className="mt-0">
						{!archivedNotifications.length && (
							<EmptyState description="Nothing in the archive" />
						)}

						{archivedNotifications.length > 0 && (
							<ScrollArea className="h-[490px]">
								<div className="divide-y">
									{archivedNotifications.map((notification) => {
										return (
											<NotificationItem
												key={notification.id}
												setOpen={setOpen}
												description={notification.payload.description}
												createdAt={notification.createdAt}
												recordId={notification.payload.recordId}
												type={notification.payload.type}
												id={undefined}
												from={undefined}
												to={undefined}
												markMessageAsRead={undefined}
											/>
										);
									})}
								</div>
							</ScrollArea>
						)}
					</TabsContent>
				</Tabs>
			</PopoverContent>
		</Popover>
	);
}
