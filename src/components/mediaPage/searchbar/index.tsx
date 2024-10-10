import { Search, Trash2 } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

import { CreatePost } from "@/components/createPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { AddAssets } from "../addAssets";
import { FiltersList } from "./filtersList";

export function SearchBar({
	selected,
	setOpen,
	searchParams,
	setSearchParams,
}: any) {
	const { currentProfileId: profileId } = useSocialProfilesStore();

	useHotkeys(
		"esc",
		() => {
			setSearchParams({
				q: "",
				type: "all",
				sort: "createdAt",
			});
		},
		{
			enableOnFormTags: true,
		},
	);

	const handleSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = evt.target;
		setSearchParams({
			q: value,
		});
	};

	return (
		<div className="mb-6 flex items-center justify-between">
			<div className="flex space-x-2">
				<div className="relative">
					<Search className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search..."
						className="w-full pl-8"
						value={searchParams.q}
						onChange={handleSearch}
						autoComplete="off"
						autoCapitalize="none"
						autoCorrect="off"
						spellCheck="false"
					/>
				</div>
				<FiltersList />
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
