import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const sectionVariants = cva("py-10 text-lg sm:py-10", {
	variants: {
		variant: {
			default: "bg-stone-100",
			secondary: "bg-stone-200",
			color: "bg-teal-950 text-white",
			transparent: "bg-transparent ",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export function Section({ children, className, variant, ...props }: any) {
	return (
		<section
			className={cn("z-10", sectionVariants({ variant }), className)}
			{...props}
		>
			<div className="container max-w-6xl 2xl:px-0">{children}</div>
		</section>
	);
}
