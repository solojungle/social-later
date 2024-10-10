import { parseAsStringLiteral, useQueryState } from "nuqs";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

function SortBy() {
	const [sort, setSort] = useQueryState("sort", {
		defaultValue: "createdAt",
	});

	return (
		<div className="flex items-center space-x-2">
			<Select value={sort} onValueChange={(value) => setSort(value)}>
				<SelectTrigger>
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="createdAt">Created At</SelectItem>
					<SelectItem value="name">Name</SelectItem>
					<SelectItem value="size">Size</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}

function FilterBy() {
	const [type, setType] = useQueryState(
		"type",
		parseAsStringLiteral(["all", "video", "image"] as const).withDefault("all"),
	);

	return (
		<div className="flex items-center space-x-2">
			<Select
				value={type}
				onValueChange={(value: "video" | "image" | "all") => setType(value)}
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
			<SortBy />
			<FilterBy />
		</div>
	);
}
