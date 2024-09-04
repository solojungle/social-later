import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type FilterByProps = {
	filterBy: "all" | "image" | "video";
	updateFilterInUrl: (newFilter: "all" | "image" | "video") => void;
};

export function FilterBy({ filterBy, updateFilterInUrl }: FilterByProps) {
	return (
		<div className="flex items-center space-x-2">
			<Select
				value={filterBy}
				onValueChange={(value) =>
					updateFilterInUrl(value as "all" | "image" | "video")
				}
			>
				<SelectTrigger className="h-9 w-9 md:w-auto">
					<SelectValue placeholder="Filter" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">All</SelectItem>
					<SelectItem value="image">Image</SelectItem>
					<SelectItem value="video">Video</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
