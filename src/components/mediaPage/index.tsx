"use client";

import { useState } from "react";

import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";

import { Separator } from "../ui/separator";
import { AllAssets } from "./allAssets";
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
	// const [sortedBy, setSortedBy] = useState("name");
	// const [filterBy, setFilterBy] = useState("all");

	const { data: attachments } = api.attachment.getAll.useQuery(
		{ teamId },
		{
			enabled: !!teamId,
		},
	);

	// We dont need the other information from the attachments
	const onlyFiles = attachments?.map((attachment) => {
		return {
			...attachment.file,
			thumbnail: attachment.thumbnail,
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
		<div>
			<Separator className="my-4" />
			<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			{/* <Folders folders={folders} /> */}
			<AllAssets assets={sortedAssets} />
		</div>
	);
}
