import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const sectionVariants = cva("py-10 text-lg sm:py-16", {
	variants: {
		variant: {
			default: "bg-stone-100",
			secondary: "bg-stone-200",
			color: "bg-teal-950 text-white",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export function Section({ children, className, variant, ...props }: any) {
	return (
		<section className={cn(sectionVariants({ variant }), className)} {...props}>
			<div className="container">{children}</div>
		</section>
	);
}
