"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import React, { forwardRef, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type BorderCheckboxProps = Omit<CheckboxPrimitive.CheckboxProps, "checked"> & {
	children?: React.ReactNode;
	checked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
};

const BorderCheckbox = forwardRef<HTMLButtonElement, BorderCheckboxProps>(
	({ className, children, checked, onCheckedChange, ...props }, ref) => {
		const [isChecked, setIsChecked] = useState(checked ?? false);

		useEffect(() => {
			setIsChecked(checked ?? false);
		}, [checked]);

		const handleToggle = () => {
			const newState = !isChecked;
			setIsChecked(newState);
			onCheckedChange?.(newState);
		};

		const handleKeyDown = (event: React.KeyboardEvent) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleToggle();
			}
		};

		return (
			<div
				className="flex w-full cursor-pointer select-none items-center rounded-lg border border-border bg-background p-4 shadow-sm transition ease-out"
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				role="button"
				tabIndex={0}
			>
				<CheckboxPrimitive.Root
					ref={ref}
					className={cn(
						"peer mr-4 h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
						className,
					)}
					checked={isChecked}
					onCheckedChange={handleToggle}
					{...props}
				>
					<CheckboxPrimitive.Indicator
						className={cn("flex items-center justify-center text-current")}
					>
						<CheckIcon className="h-4 w-4" />
					</CheckboxPrimitive.Indicator>
				</CheckboxPrimitive.Root>
				<div className="w-full">{children}</div>
			</div>
		);
	},
);

BorderCheckbox.displayName = "BorderCheckbox";

export { BorderCheckbox };
