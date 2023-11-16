import { BellIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationButtonProps extends React.HTMLAttributes<HTMLElement> {
	showDot?: boolean;
}

export function NotificationButton({
	showDot,
	className,
	...props
}: NotificationButtonProps) {
	return (
		<Button
			variant="outline"
			size="icon"
			className={cn("relative", className)}
			{...props}
		>
			<BellIcon className="h-5 text-gray-600" />
			<span className="sr-only">Notifications</span>
			{showDot && (
				<div className="absolute -end-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 dark:border-gray-900" />
			)}
		</Button>
	);
}
