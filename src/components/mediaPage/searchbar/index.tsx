import { Search, Trash2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { CreatePost } from "@/components/createPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { AddAssets } from "../addAssets";
import { FilterBy } from "../filterBy";
import { SortBy } from "../sortBy";
import { ToggleView } from "../toggleView";

type Props = {
	searchTerm: string;
	setSearchTerm: (searchTerm: string) => void;
	selected: any[];
	setOpen: (open: boolean) => void;
	sortBy: "name" | "size";
	filterBy: "all" | "image" | "video";
};

export function SearchBar({
	searchTerm,
	setSearchTerm,
	selected,
	setOpen,
	sortBy,
	filterBy,
}: Props) {
	const { currentProfileId: profileId } = useSocialProfilesStore();

	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	const updateSearchInUrl = (newSearchTerm: string) => {
		const newQueryString = createQueryString("search", newSearchTerm);
		router.push(`${pathname}?${newQueryString}`);
	};

	const updateFilterInUrl = (newFilter: "all" | "image" | "video") => {
		const newQueryString = createQueryString("filter", newFilter);
		router.push(`${pathname}?${newQueryString}`);
	};

	const updateSortInUrl = (newSort: "name" | "size") => {
		const newQueryString = createQueryString("sort", newSort);
		router.push(`${pathname}?${newQueryString}`);
	};

	function handleSearchTermChange(newSearchTerm: string) {
		setSearchTerm(newSearchTerm);
		updateSearchInUrl(newSearchTerm);
	}

	return (
		<div className="mb-6 flex items-center justify-between">
			<div className="flex space-x-2">
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search..."
						className="w-full pl-8"
						value={searchTerm}
						onChange={(e) => handleSearchTermChange(e.target.value)}
					/>
				</div>
				<SortBy updateSortInUrl={updateSortInUrl} sortBy={sortBy} />
				<FilterBy updateFilterInUrl={updateFilterInUrl} filterBy={filterBy} />
				<ToggleView defaultView="grid" />
				<Button
					size="icon"
					variant="outline"
					className="shrink-0"
					onClick={() => setOpen(true)}
					disabled={!selected || selected.length === 0}
				>
					<Trash2 className="w-4" />
				</Button>
			</div>
			<div className="ml-4 flex space-x-2">
				<CreatePost
					profileId={profileId}
					scheduleDate={new Date()}
					disabled={!profileId || selected.length === 0}
					selected={selected}
				/>
				<AddAssets />
			</div>
		</div>
	);
}
