import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export const sectionVariants = cva("py-10 text-lg sm:py-10", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      color: "bg-teal-950 text-white",
      default: "bg-stone-100",
      secondary: "bg-stone-200",
      transparent: "bg-transparent ",
    },
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
