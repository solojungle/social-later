"use client";

import {
	KnockProvider,
	useKnockClient,
	useNotifications,
	useNotificationStore,
} from "@knocklabs/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { env } from "@/env.mjs";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";

import { NotificationButton } from "../navigationbar/notificationButton";
import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NotificationItem } from "./notificationItem";

function EmptyState({ description }: { description: string }) {
	return (
		<div className="flex h-[460px] flex-col items-center justify-center space-y-4">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
				<InterfaceIcons.Archive className="h-4 w-4 shrink-0" />
			</div>
			<p className="text-sm text-[#606060]">{description}</p>
		</div>
	);
}

function NotificationFeed() {
	const { members } = useTeamMembersStore();
	// const { id: userId } = useUserStore();
	// const { id: teamId } = useSelectedTeamStore();
	const [isOpen, setOpen] = useState(false);

	const knockClient = useKnockClient();
	const feedClient = useNotifications(
		knockClient,
		env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID,
	);

	const { items, metadata } = useNotificationStore(feedClient);

	useEffect(() => {
		feedClient.fetch();
	}, [feedClient]);

	const hasUnreadNotifications = metadata.unread_count > 0;

	const notifications = items.map((item) => {
		return {
			id: item.id,
			createdAt: item.inserted_at,
			read: item.read_at !== null,
			payload: {
				message: item.data?.message,
				recordId: item.id,
				type: item.data?.type,
				from: members.find(
					(member) => member.id === item.activities[0]?.actor?.id,
				),
				to: item.activities[0]?.recipient?.id,
				files: item.data?.files,
			},
		};
	});

	const markAllMessagesAsRead = async () => {
		await feedClient.markAllAsRead();
	};

	const markAllMessagesAsSeen = async () => {
		await feedClient.markAllAsSeen();
	};

	const unreadNotifications = notifications.filter(
		(notification) => !notification.read,
	);

	const archivedNotifications = notifications.filter(
		(notification) => notification.read,
	);

	return (
		<Popover onOpenChange={setOpen} open={isOpen}>
			<PopoverTrigger asChild>
				<NotificationButton
					showDot={hasUnreadNotifications}
					onClick={() => {
						markAllMessagesAsSeen();
					}}
				/>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				className="relative h-[535px] w-screen overflow-hidden p-0 md:w-[400px]"
				sideOffset={5}
			>
				<Tabs defaultValue="all">
					<TabsList className="w-full justify-start rounded-none border-b-[1px] bg-transparent py-6">
						<TabsTrigger
							value="all"
							className="font-normal !shadow-none [&>div]:data-[state=active]:bg-foreground [&>div]:data-[state=active]:text-background"
						>
							<span className="mr-2">All</span>
							<div className="rounded-sm bg-muted px-1 py-px text-xs text-muted-foreground transition-colors duration-200">
								{metadata.unread_count}
							</div>
						</TabsTrigger>
						<TabsTrigger
							value="read"
							className="font-normal !shadow-none [&>div]:data-[state=active]:bg-foreground [&>div]:data-[state=active]:text-background"
						>
							<span className="mr-2">Read</span>
							<div className="rounded-sm bg-muted px-1 py-px text-xs text-muted-foreground transition-colors duration-200">
								{metadata.total_count - metadata.unread_count}
							</div>
						</TabsTrigger>
					</TabsList>

					<Link
						href="/settings/notifications"
						className="absolute right-[11px] top-1.5"
					>
						<Button
							variant="ghost"
							size="icon"
							className="hover:bg-accent"
							onClick={() => setOpen(false)}
						>
							<InterfaceIcons.Settings className="h-4 w-4 shrink-0" />
						</Button>
					</Link>

					<TabsContent value="all" className="relative mt-0">
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
												setOpen={setOpen}
												message={notification.payload.message}
												createdAt={notification.createdAt}
												recordId={notification.payload.recordId}
												type={notification.payload.type}
												from={notification.payload?.from}
												to={notification.payload?.to}
												files={notification.payload?.files}
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
									Mark all as read
								</Button>
							</div>
						)}
					</TabsContent>

					<TabsContent value="read" className="mt-0">
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
												message={notification.payload.message}
												createdAt={notification.createdAt}
												recordId={notification.payload.recordId}
												type={notification.payload.type}
												from={notification.payload?.from}
												to={notification.payload?.to}
												files={notification.payload?.files}
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

export function NotificationCenter() {
	const { id: userId } = useUserStore();

	return (
		<KnockProvider apiKey={env.NEXT_PUBLIC_KNOCK_KEY} userId={userId}>
			<NotificationFeed />
		</KnockProvider>
	);
}
