import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { NotificationButton } from "./notificationButton";
import { NotificationContent } from "./notificationContent";
import { TextLinks } from "./textLinks";
import { UserMenu } from "./userMenu";

export function NavigationBar() {
	return (
		<div className="flex h-16 items-center px-4">
			{/* <TeamSwitcher /> */}
			<TextLinks className="mx-6" />
			{/* <CreatePost /> */}
			<div className="ml-auto flex items-center space-x-4">
				<Popover>
					<PopoverTrigger asChild>
						{/* <NotificationButton showDot /> */}
					</PopoverTrigger>
					<PopoverContent
						side="bottom"
						align="end"
						className="overflow-hidden text-ellipsis"
					>
						<NotificationContent />
					</PopoverContent>
				</Popover>
				<UserMenu />
			</div>
		</div>
	);
}
