"use client";

import { FileIcon, Folder, PlusIcon, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { FilterBy } from "./filterBy";
import { PagePagination } from "./pagination";
import { SortBy } from "./sortBy";

// Dummy data for folders and assets
const folders = [
	{ id: 1, name: "Articles", count: 16 },
	{ id: 2, name: "Covers", count: 32 },
	{ id: 3, name: "Pictures", count: 927 },
	{ id: 4, name: "Team", count: 83 },
	{ id: 5, name: "Testimonials", count: 146 },
	{ id: 6, name: "Videos", count: 58 },
];

const assets = [
	{ id: 1, name: "landscape.png", type: "image/png", size: "3209×2500" },
	{ id: 2, name: "indoorplants.png", type: "image/png", size: "580×280" },
	{
		id: 3,
		name: "interior-design-pro-HD.png",
		type: "image/png",
		size: "3200×1295",
	},
	{ id: 4, name: "moon.png", type: "image/png", size: "806×490" },
	{ id: 5, name: "white_flowers.jpeg", type: "image/jpeg", size: "1805×1265" },
	{ id: 6, name: "sparkles.png", type: "image/png", size: "24×24" },
	{ id: 7, name: "minimal_light.png", type: "image/png", size: "235×708" },
	{ id: 8, name: "dark-sky-bridge.jpeg", type: "image/jpeg", size: "925×263" },
];

export function MediaPageContent() {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortedBy, setSortedBy] = useState("name");
	const [filterBy, setFilterBy] = useState("all");

	const filteredAssets = assets.filter((asset) =>
		asset.name.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const sortedAssets = filteredAssets.sort((a, b) => {
		if (sortedBy === "name") return a.name.localeCompare(b.name);
		if (sortedBy === "size") return a.size.localeCompare(b.size);
		return 0;
	});

	return (
		<div className="">
			{/* Search Bar */}
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

			{/* Folders */}
			<div>
				<h3 className="mb-4 font-medium">Folders</h3>
				<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
					{folders.map((folder) => (
						<div
							key={folder.id}
							className="flex items-center rounded-sm border border-border bg-background p-2 text-xs text-foreground shadow-sm"
						>
							<Checkbox className="mr-4" />
							<Folder className="mr-4 h-6 w-6" />
							<div>
								<div className="font-medium">{folder.name}</div>
								<div className="text-muted-foreground">
									{folder.count} assets
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<Separator className="my-4" />

			{/* <div className="mb-6 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<label className="text-sm">Sort by:</label>
					<select
						className="select select-bordered"
						value={sortedBy}
						onChange={(e) => setSortedBy(e.target.value)}
					>
						<option value="name">Name</option>
						<option value="size">Size</option>
					</select>
				</div>

				<div className="flex items-center space-x-2">
					<label className="text-sm">Filter:</label>
					<select
						className="select select-bordered"
						value={filterBy}
						onChange={(e) => setFilterBy(e.target.value)}
					>
						<option value="all">All</option>
						<option value="images">Images</option>
						<option value="videos">Videos</option>
					</select>
				</div>
			</div>  */}

			{/* Assets */}
			<div>
				<h3 className="mb-4 font-medium">All Assets</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{sortedAssets.map((asset) => (
						<div
							key={asset.id}
							className="flex flex-col rounded-md border border-border"
						>
							<img
								src="https://picsum.photos/200"
								alt={asset.name}
								className="aspect-video w-full grow rounded-t-md object-cover"
							/>
							<div className="flex h-14 items-center rounded-b-md border-t border-border bg-muted p-2">
								<div className="w-full">
									<div className="mb-px text-sm font-medium">{asset.name}</div>
									<div className="text-xs uppercase text-muted-foreground">
										{asset.type} - {asset.size}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="my-8">
				<PagePagination />
			</div>
		</div>
	);
}
