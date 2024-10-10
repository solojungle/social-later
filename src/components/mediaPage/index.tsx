"use client";

import {
	parseAsInteger,
	parseAsString,
	parseAsStringLiteral,
	useQueryStates,
} from "nuqs";
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
	const [searchParams, setSearchParams] = useQueryStates(
		{
			q: parseAsString.withDefault(""),
			page: parseAsInteger.withDefault(1),
			sort: parseAsStringLiteral([
				"name",
				"size",
				"createdAt",
			] as const).withDefault("createdAt"),
			order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
			type: parseAsStringLiteral([
				"all",
				"video",
				"image",
			] as const).withDefault("all"),
		},
		{
			shallow: false,
		},
	);

	const { id: teamId } = useSelectedTeamStore();
	const [selected, setSelected] = useState<any[]>([]);
	const [open, setOpen] = useState(false);

	const { isLoading, data, isFetching, isPlaceholderData } =
		api.attachment.getAll.useQuery(
			{
				teamId,
				searchQuery: searchParams.q,
				fileType: searchParams.type,
				sortBy: searchParams.sort,
				sortOrder: searchParams.order,
				page: searchParams.page,
			},
			{
				keepPreviousData: true,
				enabled: !!teamId,
			},
		);

	if (isLoading || !data) {
		return (
			<div className="flex h-96 flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="h-full">
			<AlertDialog open={open} onOpenChange={setOpen}>
				<DeleteAssetContent setShowDeleteDialog={setOpen} selected={selected} />
			</AlertDialog>
			<Separator className="my-4" />
			<SearchBar
				selected={selected}
				setOpen={setOpen}
				searchParams={searchParams}
				setSearchParams={setSearchParams}
			/>
			<AllAssets
				assets={data.items}
				selected={selected}
				setSelected={setSelected}
				pagination={{ data, isPlaceholderData, isFetching }}
			/>
		</div>
	);
}
