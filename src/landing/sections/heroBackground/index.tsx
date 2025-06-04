import Image from "next/image";

import { cn } from "@/lib/utils";

export function HeroBackground({
  alt,
  className,
  src,
}: {
  alt: string;
  className?: string;
  src: string;
}) {
  return (
    <div className="absolute inset-0 z-0">
      <Image
        alt={alt}
        className={cn(
          "block h-[130vh] w-full bg-stone-100 md:h-[170vh]",
          className,
        )}
        height={1000}
        src={src}
        width={1000}
      />
      {/* Gradient overlay for bottom fade */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" /> */}
    </div>
  );
}
