import { HeadlessService, IMessage } from "@novu/headless";
import { useCallback, useEffect, useRef, useState } from "react";

import { env } from "@/env.mjs";

export type NotificationEventTypes = "join" | "leave" | "message" | "upload";

type UseNotificationsProps = {
	userId: string;
	teamId: string;
};

export function useNotifications({ userId, teamId }: UseNotificationsProps) {
	const [isLoading, setLoading] = useState(true);
	const [notifications, setNotifications] = useState<IMessage[]>([]);
	const [subscriberId] = useState<string | undefined>(`${teamId}_${userId}`);
	const headlessServiceRef = useRef<HeadlessService>();

	const markAllMessagesAsRead = () => {
		const headlessService = headlessServiceRef.current;

		if (headlessService) {
			setNotifications((prevNotifications) =>
				prevNotifications.map((notification) => {
					return {
						...notification,
						read: true,
					};
				}),
			);

			headlessService.markAllMessagesAsRead({
				listener: () => {},
				onError: () => {},
			});
		}
	};

	const markMessageAsRead = (messageId: string) => {
		const headlessService = headlessServiceRef.current;

		if (headlessService) {
			setNotifications((prevNotifications) =>
				prevNotifications.map((notification) => {
					if (notification.id === messageId) {
						return {
							...notification,
							read: true,
						};
					}

					return notification;
				}),
			);

			headlessService.markNotificationsAsRead({
				messageId: [messageId],
				listener: (result) => {},
				onError: (error) => {},
			});
		}
	};

	const fetchNotifications = useCallback(() => {
		const headlessService = headlessServiceRef.current;

		if (headlessService) {
			headlessService.fetchNotifications({
				listener: ({}) => {},
				onSuccess: (response) => {
					setLoading(false);
					setNotifications(response.data);
				},
			});
		}
	}, []);

	const markAllMessagesAsSeen = () => {
		const headlessService = headlessServiceRef.current;

		if (headlessService) {
			setNotifications((prevNotifications) =>
				prevNotifications.map((notification) => ({
					...notification,
					seen: true,
				})),
			);
			headlessService.markAllMessagesAsSeen({
				listener: () => {},
				onError: () => {},
			});
		}
	};

	useEffect(() => {
		const headlessService = headlessServiceRef.current;

		if (headlessService) {
			headlessService.listenNotificationReceive({
				listener: () => {
					fetchNotifications();
				},
			});
		}
	}, [fetchNotifications]);

	useEffect(() => {
		if (subscriberId && !headlessServiceRef.current) {
			const headlessService = new HeadlessService({
				applicationIdentifier: env.NOVU_APP_ID!,
				subscriberId,
			});

			headlessService.initializeSession({
				listener: () => {},
				onSuccess: () => {
					headlessServiceRef.current = headlessService;
					fetchNotifications();
				},
				onError: () => {},
			});
		}
	}, [fetchNotifications, subscriberId]);

	return {
		isLoading,
		markAllMessagesAsRead,
		markMessageAsRead,
		markAllMessagesAsSeen,
		hasUnseenNotifications: notifications.some(
			(notification) => !notification.seen,
		),
		notifications,
	};
}
