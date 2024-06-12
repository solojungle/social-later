import { FileIcon, Folder, PlusIcon, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FilterBy } from "../filterBy";
import { SortBy } from "../sortBy";

type Props = {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
};

export function SearchBar({ searchTerm, setSearchTerm }: Props) {
	return (
		<div className="mb-6 flex items-center justify-between">
			<div className="flex space-x-2">
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search..."
						className="w-full pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<SortBy />
				<FilterBy />
			</div>
			<div className="ml-4 flex space-x-2">
				<Button>
					<PlusIcon className="mr-1 h-5 w-5" />
					<Folder className="h-5 w-5 lg:invisible" />
					<span className="sr-only line-clamp-1 lg:not-sr-only">
						Add Folder
					</span>
				</Button>
				<Button variant="secondary">
					<PlusIcon className="mr-1 h-5 w-5" />
					<FileIcon className="h-5 w-5 lg:invisible" />
					<span className="sr-only line-clamp-1 lg:not-sr-only">
						Add Assets
					</span>
				</Button>
			</div>
		</div>
	);
}
