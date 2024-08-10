// The different types of events that can be listened to
export type NotificationEventTypes = "join" | "leave" | "message" | "upload";

export function useNotifications() {
	// const supabase = createClient();
	// const [isLoading, setLoading] = useState(true);
	// const [notifications, setNotifications] = useState([]);
	// const [subscriberId, setSubscriberId] = useState();
	// const headlessServiceRef = useRef<HeadlessService>();

	// const markAllMessagesAsRead = () => {
	// 	const headlessService = headlessServiceRef.current;

	// 	if (headlessService) {
	// 		setNotifications((prevNotifications) =>
	// 			prevNotifications.map((notification) => {
	// 				return {
	// 					...notification,
	// 					read: true,
	// 				};
	// 			}),
	// 		);

	// 		headlessService.markAllMessagesAsRead({
	// 			listener: () => {},
	// 			onError: () => {},
	// 		});
	// 	}
	// };

	// const markMessageAsRead = (messageId: string) => {
	// 	const headlessService = headlessServiceRef.current;

	// 	if (headlessService) {
	// 		setNotifications((prevNotifications) =>
	// 			prevNotifications.map((notification) => {
	// 				if (notification.id === messageId) {
	// 					return {
	// 						...notification,
	// 						read: true,
	// 					};
	// 				}

	// 				return notification;
	// 			}),
	// 		);

	// 		headlessService.markNotificationsAsRead({
	// 			messageId: [messageId],
	// 			listener: (result) => {},
	// 			onError: (error) => {},
	// 		});
	// 	}
	// };

	// const fetchNotifications = useCallback(() => {
	// 	const headlessService = headlessServiceRef.current;

	// 	if (headlessService) {
	// 		headlessService.fetchNotifications({
	// 			listener: ({}) => {},
	// 			onSuccess: (response) => {
	// 				setLoading(false);
	// 				setNotifications(response.data);
	// 			},
	// 		});
	// 	}
	// }, []);

	// const markAllMessagesAsSeen = () => {
	// 	const headlessService = headlessServiceRef.current;

	// 	if (headlessService) {
	// 		setNotifications((prevNotifications) =>
	// 			prevNotifications.map((notification) => ({
	// 				...notification,
	// 				read: true,
	// 			})),
	// 		);
	// 		headlessService.markAllMessagesAsSeen({
	// 			listener: () => {},
	// 			onError: () => {},
	// 		});
	// 	}
	// };

	// useEffect(() => {
	// 	async function fetchUser() {
	// 		const {
	// 			data: { session },
	// 		} = await supabase.auth.getSession();

	// 		const { data: userData } = await getUserQuery(
	// 			supabase,
	// 			session?.user?.id,
	// 		);

	// 		if (userData) {
	// 			setSubscriberId(`${userData.team_id}_${userData.id}`);
	// 		}
	// 	}

	// 	fetchUser();
	// }, [supabase]);

	// useEffect(() => {
	// 	const headlessService = headlessServiceRef.current;

	// 	if (headlessService) {
	// 		headlessService.listenNotificationReceive({
	// 			listener: () => {
	// 				fetchNotifications();
	// 			},
	// 		});
	// 	}
	// }, [headlessServiceRef.current]);

	// useEffect(() => {
	// 	if (subscriberId && !headlessServiceRef.current) {
	// 		const headlessService = new HeadlessService({
	// 			applicationIdentifier:
	// 				process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER!,
	// 			subscriberId,
	// 		});

	// 		headlessService.initializeSession({
	// 			listener: () => {},
	// 			onSuccess: () => {
	// 				headlessServiceRef.current = headlessService;
	// 				fetchNotifications();
	// 			},
	// 			onError: () => {},
	// 		});
	// 	}
	// }, [fetchNotifications, subscriberId]);

	// Filler variables
	const isLoading = false;
	const markAllMessagesAsRead = () => {};
	const markMessageAsRead = () => {};
	const markAllMessagesAsSeen = () => {};
	const notifications = [
		{
			id: "1",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "join",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar1.png",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "2",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				files: [
					{
						thumbnailUrl: "images/avatar1.png",
						name: "File 1.png",
						downloadUrl: "images/avatar1.png",
					},
					{
						thumbnailUrl: "images/avatar1.png",
						name: "File 1.png",
						downloadUrl: "images/avatar1.png",
					},
					{
						thumbnailUrl: "images/avatar1.png",
						name: "File 1.png",
						downloadUrl: "images/avatar1.png",
					},
				],
				type: "upload",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar2.jpg",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "3",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "inbox",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar3.jpg",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "4",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "match",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar4.jpg",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "5",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "type",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar1.png",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "6",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "type",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar2.jpg",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: true,
		},
		{
			id: "7",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "type",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar1.png",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "8",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "type",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar1.png",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "9",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "type",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar1.png",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
		{
			id: "10",
			title: "Notification Title",
			description: "Notification Description",
			payload: {
				description: "Notification Description",
				recordId: "1",
				type: "type",
				from: {
					id: "1",
					name: "Ali Awari",
					imageUrl: "images/avatar1.png",
				},
				to: "to",
			},
			createdAt: "2021-09-01T12:00:00Z",
			read: false,
		},
	];

	return {
		isLoading,
		markAllMessagesAsRead,
		markMessageAsRead,
		markAllMessagesAsSeen,
		hasUnseenNotifications: notifications.some(
			(notification) => !notification.read,
		),
		notifications,
	};
}
