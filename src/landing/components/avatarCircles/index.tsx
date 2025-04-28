import { cn } from "@/lib/utils";
import { StarHalfIcon, StarIcon } from "lucide-react";

interface AvatarCirclesProps {
  avatarUrls: string[];
  className?: string;
}

export function AvatarCircles({ avatarUrls, className }: AvatarCirclesProps) {
  return (
    <div className="mt-8 flex items-center space-x-2">
      <div
        className={cn("z-10 flex -space-x-3 rtl:space-x-reverse", className)}
      >
        {avatarUrls.map((url, index) => (
          <img
            alt={`Avatar ${index + 1}`}
            className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-800"
            height={40}
            key={url}
            src={url}
            width={40}
          />
        ))}
      </div>
      <div className="flex flex-col">
        <div className="mb-px flex items-center rtl:mr-2">
          <StarIcon className="flex h-4 w-4 items-center fill-yellow-300" />
          <StarIcon className="flex h-4 w-4 items-center fill-yellow-300" />
          <StarIcon className="flex h-4 w-4 items-center fill-yellow-300" />
          <StarIcon className="flex h-4 w-4 items-center fill-yellow-300" />
          <StarHalfIcon className="flex h-4 w-4 items-center fill-yellow-300" />
          <p className="text-xs">(4.78)</p>
        </div>
        <p className="text-xs">
          Over 100+ reviews on <u>ProductHunt</u>
        </p>
      </div>
    </div>
  );
}
