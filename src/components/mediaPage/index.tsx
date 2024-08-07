"use client";

import { useState } from "react";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { AlertDialog } from "../ui/alert-dialog";
import { InterfaceIcons } from "../ui/icons";
import { Separator } from "../ui/separator";
import { AllAssets } from "./allAssets";
import { DeleteAssetContent } from "./deleteAsset";
import { SearchBar } from "./searchbar";

export function MediaPageContent() {
	const { id: teamId } = useSelectedTeamStore();
	const [searchTerm, setSearchTerm] = useState("");
	const [sortedBy] = useState("name");
	const [selected, setSelected] = useState<any[]>([]);
	const [open, setOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(0);
	const [pageSize, setPageSize] = useState<2 | 4 | 8>(2);

	// const [sortedBy, setSortedBy] = useState("name");
	// const [filterBy, setFilterBy] = useState("all");

	const {
		data,
		isLoading,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
		fetchPreviousPage,
		isRefetching,
	} = api.attachment.getAll.useInfiniteQuery(
		{ teamId, limit: 4 * pageSize },
		{
			enabled: !!teamId,
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			getPreviousPageParam: (firstPage) => firstPage.nextCursor,
			// trpc: { context: { skipBatch: true } }, // not sure if this is needed
		},
	);

	if (isLoading) {
		return (
			<div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	// const attachments = data?.pages.flatMap((page) => page.items);
	const attachments = data?.pages[currentPage]?.items ?? [];

	// We dont need the other information from the attachments
	const onlyFiles = attachments?.map((attachment) => {
		return {
			...attachment.file,
			thumbnail: attachment.thumbnail,
			url: attachment.url,
		};
	});

	if (!attachments || !onlyFiles) {
		return null;
	}

	const filteredAssets = onlyFiles.filter((asset) =>
		asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const sortedAssets = filteredAssets.sort((a, b) => {
		if (sortedBy === "name") return a.name.localeCompare(b.name);
		if (sortedBy === "size") {
			const sizeA = String(a.size);
			const sizeB = String(b.size);

			return sizeA.localeCompare(sizeB);
		}
		return 0;
	});

	return (
		<div className="h-full">
			<AlertDialog open={open} onOpenChange={setOpen}>
				<DeleteAssetContent setShowDeleteDialog={setOpen} selected={selected} />
			</AlertDialog>
			<Separator className="my-4" />
			<SearchBar
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				selected={selected}
				setOpen={setOpen}
			/>
			<AllAssets
				assets={sortedAssets}
				selected={selected}
				setSelected={setSelected}
				pagination={{
					isFetchingNextPage,
					fetchNextPage,
					hasNextPage,
					loadedPageLength: data?.pages.length ?? 0,
					isRefetching,
					fetchPreviousPage,
					setPageSize,
					pageSize,
					setCurrentPage,
					currentPage,
					totalPages: data?.pages[0]?.totalPages ?? 0,
					totalCount: data?.pages[0]?.totalCount ?? 0,
				}}
			/>
		</div>
	);
}
