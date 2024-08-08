import * as React from "react";

import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface NotificationButtonProps extends React.HTMLAttributes<HTMLElement> {
	showDot?: boolean;
}

const NotificationButton = React.forwardRef<
	HTMLButtonElement,
	NotificationButtonProps
>(({ showDot, className, ...props }, ref) => {
	return (
		<Button
			variant="outline"
			size="icon"
			className={cn("relative", className)}
			ref={ref}
			{...props}
		>
			<InterfaceIcons.Notifications className="h-5 text-foreground" />
			<span className="sr-only">Notifications</span>
			{showDot && (
				<div className="absolute -end-1 -top-1 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 dark:border-gray-900" />
			)}
		</Button>
	);
});

NotificationButton.displayName = "NotificationButton";

export { NotificationButton };
