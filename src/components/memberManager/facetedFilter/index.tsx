import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export function FacetedFilter() {
	return (
		<div className="flex items-center space-x-2 py-3">
			<Input type="search" placeholder="Filter..." />
			<div className="flex items-center space-x-2">
				<Select>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="All Team Roles" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="owner">Owner</SelectItem>
						<SelectItem value="member">Member</SelectItem>
					</SelectContent>
				</Select>
				<Select>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Default" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="default">Default</SelectItem>
						<SelectItem value="date">Date</SelectItem>
						<SelectItem value="dsc">Name (A-Z)</SelectItem>
						<SelectItem value="asc">Name (Z-A)</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
