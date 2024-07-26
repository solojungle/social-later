import { StarHalfIcon, StarIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface AvatarCirclesProps {
	className?: string;
	numPeople?: number;
	avatarUrls: string[];
}

export function AvatarCircles({
	numPeople,
	className,
	avatarUrls,
}: AvatarCirclesProps) {
	return (
		<div className="mt-8 flex items-center space-x-2">
			<div
				className={cn("z-10 flex -space-x-3 rtl:space-x-reverse", className)}
			>
				{avatarUrls.map((url, index) => (
					<img
						key={url}
						className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-800"
						src={url}
						width={40}
						height={40}
						alt={`Avatar ${index + 1}`}
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
