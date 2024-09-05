import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

type SortByProps = {
	sortBy: "name" | "size";
	updateSortInUrl: (newSort: "name" | "size") => void;
};

function SortBy({ sortBy, updateSortInUrl }: SortByProps) {
	return (
		<div className="flex items-center space-x-2">
			<Select
				value={sortBy}
				onValueChange={(value) => updateSortInUrl(value as "name" | "size")}
			>
				<SelectTrigger>
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="name">Name</SelectItem>
					<SelectItem value="size">Size</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

type FilterByProps = {
	filterBy: "all" | "image" | "video";
	updateFilterInUrl: (newFilter: "all" | "image" | "video") => void;
};

function FilterBy({ filterBy, updateFilterInUrl }: FilterByProps) {
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

export function FiltersList() {
	return (
		<div className="flex items-center space-x-2">
			<SortBy sortBy="name" updateSortInUrl={() => {}} />
			<FilterBy filterBy="all" updateFilterInUrl={() => {}} />
		</div>
	);
}
