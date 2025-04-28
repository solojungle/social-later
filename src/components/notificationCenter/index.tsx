"use client";

import { env } from "@/env.mjs";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import {
  KnockProvider,
  useKnockClient,
  useNotifications,
  useNotificationStore,
} from "@knocklabs/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { NotificationButton } from "../navigationbar/notificationButton";
import { Button } from "../ui/button";
import { InterfaceIcons } from "../ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ScrollArea } from "../ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NotificationItem } from "./notificationItem";

export function NotificationCenter() {
  const { id: userId } = useUserStore();

  return (
    <KnockProvider apiKey={env.NEXT_PUBLIC_KNOCK_KEY} userId={userId}>
      <NotificationFeedWrapper />
    </KnockProvider>
  );
}

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

function NotificationFeed({ knockClient }: { knockClient: any }) {
  // const { id: userId } = useUserStore();
  // const { id: teamId } = useSelectedTeamStore();
  const { members } = useTeamMembersStore();
  const [isOpen, setOpen] = useState(false);

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
      createdAt: item.inserted_at,
      id: item.id,
      payload: {
        files: item.data?.files,
        from: members.find(
          (member) => member.id === item.activities[0]?.actor?.id,
        ),
        message: item.data?.message,
        recordId: item.id,
        to: item.activities[0]?.recipient?.id,
        type: item.data?.type,
      },
      read: item.read_at !== null,
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
          onClick={() => {
            markAllMessagesAsSeen();
          }}
          showDot={hasUnreadNotifications}
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
              className="font-normal !shadow-none [&>div]:data-[state=active]:bg-foreground [&>div]:data-[state=active]:text-background"
              value="all"
            >
              <span className="mr-2">All</span>
              <div className="rounded-sm bg-muted px-1 py-px text-xs text-muted-foreground transition-colors duration-200">
                {metadata.unread_count}
              </div>
            </TabsTrigger>
            <TabsTrigger
              className="font-normal !shadow-none [&>div]:data-[state=active]:bg-foreground [&>div]:data-[state=active]:text-background"
              value="read"
            >
              <span className="mr-2">Read</span>
              <div className="rounded-sm bg-muted px-1 py-px text-xs text-muted-foreground transition-colors duration-200">
                {metadata.total_count - metadata.unread_count}
              </div>
            </TabsTrigger>
          </TabsList>

          <Link
            className="absolute right-[11px] top-1.5"
            href="/settings/notifications"
          >
            <Button
              className="hover:bg-accent"
              onClick={() => setOpen(false)}
              size="icon"
              variant="ghost"
            >
              <InterfaceIcons.Settings className="h-4 w-4 shrink-0" />
            </Button>
          </Link>

          <TabsContent className="relative mt-0" value="all">
            {!unreadNotifications.length && (
              <EmptyState description="No new notifications" />
            )}

            {unreadNotifications.length > 0 && (
              <ScrollArea className="h-[485px] pb-12">
                <div className="divide-y">
                  {unreadNotifications.map((notification) => {
                    return (
                      <NotificationItem
                        createdAt={notification.createdAt}
                        files={notification.payload?.files}
                        from={notification.payload?.from}
                        id={notification.id}
                        key={notification.id}
                        message={notification.payload.message}
                        recordId={notification.payload.recordId}
                        setOpen={setOpen}
                        to={notification.payload?.to}
                        type={notification.payload.type}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {unreadNotifications.length > 0 && (
              <div className="absolute bottom-0 flex h-12 w-full items-center justify-center border-t-[1px]">
                <Button
                  className="bg-transparent"
                  onClick={markAllMessagesAsRead}
                  variant="secondary"
                >
                  Mark all as read
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent className="mt-0" value="read">
            {!archivedNotifications.length && (
              <EmptyState description="Nothing in the archive" />
            )}

            {archivedNotifications.length > 0 && (
              <ScrollArea className="h-[490px]">
                <div className="divide-y">
                  {archivedNotifications.map((notification) => {
                    return (
                      <NotificationItem
                        createdAt={notification.createdAt}
                        files={notification.payload?.files}
                        from={notification.payload?.from}
                        key={notification.id}
                        message={notification.payload.message}
                        recordId={notification.payload.recordId}
                        setOpen={setOpen}
                        to={notification.payload?.to}
                        type={notification.payload.type}
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

function NotificationFeedWrapper() {
  const knockClient = useKnockClient();

  if (!knockClient) {
    return null;
  }

  return <NotificationFeed knockClient={knockClient} />;
}
