import { Folder, PlusIcon, Search, Trash2 } from "lucide-react";

import { CreatePost } from "@/components/createPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { FilterBy } from "../filterBy";
import { SortBy } from "../sortBy";
import { ToggleView } from "../toggleView";

type Props = {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	selected: any[];
};

export function SearchBar({ searchTerm, setSearchTerm, selected }: Props) {
	const { currentProfileId: profileId } = useSocialProfilesStore();

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
				<ToggleView defaultView="grid" />
				<Button
					size="icon"
					variant="outline"
					className="shrink-0"
					disabled={!selected || selected.length === 0}
				>
					<Trash2 className="h-4" />
				</Button>
			</div>
			<div className="ml-4 flex space-x-2">
				<CreatePost
					profileId={profileId}
					scheduleDate={new Date()}
					disabled={!profileId || selected.length === 0}
					selected={selected}
				/>
				<Button>
					<PlusIcon className="mr-1 h-5 w-5" />
					<Folder className="h-5 w-5 lg:invisible" />
					<span className="sr-only line-clamp-1 lg:not-sr-only">
						Add Assets
					</span>
				</Button>
			</div>
		</div>
	);
}
