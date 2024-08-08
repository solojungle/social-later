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
			<div className="relative">
				{showDot && (
					<div className="absolute -top-1 right-0 inline-flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-red-500 dark:border-gray-900" />
				)}
				<InterfaceIcons.Notifications className="h-5 shrink-0 text-foreground" />
				<span className="sr-only">Notifications</span>
			</div>
		</Button>
	);
});

NotificationButton.displayName = "NotificationButton";

export { NotificationButton };
