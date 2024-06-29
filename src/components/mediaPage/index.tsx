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

// Dummy data for folders and assets
// const folders = [
// 	{ id: 1, name: "Articles", count: 16 },
// 	{ id: 2, name: "Covers", count: 32 },
// 	{ id: 3, name: "Pictures", count: 927 },
// 	{ id: 4, name: "Team", count: 83 },
// 	{ id: 5, name: "Testimonials", count: 146 },
// 	{ id: 6, name: "Videos", count: 58 },
// ];

// const assets = [
// 	{ id: 1, name: "landscape.png", type: "image/png", size: "3209×2500" },
// 	{ id: 2, name: "indoorplants.png", type: "image/png", size: "580×280" },
// 	{
// 		id: 3,
// 		name: "interior-design-pro-HD.png",
// 		type: "image/png",
// 		size: "3200×1295",
// 	},
// 	{ id: 4, name: "moon.png", type: "image/png", size: "806×490" },
// 	{ id: 5, name: "white_flowers.jpeg", type: "image/jpeg", size: "1805×1265" },
// 	{ id: 6, name: "sparkles.png", type: "image/png", size: "24×24" },
// 	{ id: 7, name: "minimal_light.png", type: "image/png", size: "235×708" },
// 	{ id: 8, name: "dark-sky-bridge.jpeg", type: "image/jpeg", size: "925×263" },
// ];

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
				<DeleteAssetContent />
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
