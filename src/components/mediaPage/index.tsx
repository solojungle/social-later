"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { AlertDialog } from "../ui/alert-dialog";
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

	// const [sortedBy, setSortedBy] = useState("name");
	// const [filterBy, setFilterBy] = useState("all");

	const {
		data: attachments,
		isFetching,
		isLoading,
	} = api.attachment.getAll.useQuery(
		{ teamId },
		{
			enabled: !!teamId,
		},
	);

	if (isFetching || isLoading) {
		return (
			<div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center">
				<Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

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
			/>
		</div>
	);
}
