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

export function SortBy({ sortBy, updateSortInUrl }: SortByProps) {
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
