import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function SortBy() {
	return (
		<div className="flex items-center space-x-2">
			<Select>
				<SelectTrigger className="w-40">
					<SelectValue placeholder="Sort by" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="owner">Owner</SelectItem>
					<SelectItem value="member">Member</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
