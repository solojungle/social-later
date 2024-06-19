import { ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FilterBy() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="h-9 w-9 md:w-auto">
					<ListFilter className="h-4 shrink-0" />
					<span className="sr-only md:not-sr-only">Filter</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				<DropdownMenuCheckboxItem checked>Fulfilled</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Declined</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>Refunded</DropdownMenuCheckboxItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
