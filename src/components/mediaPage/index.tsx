"use client";

import { Asset } from "@/schemas/file-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import { useState } from "react";

import { AlertDialog } from "../ui/alert-dialog";
import { InterfaceIcons } from "../ui/icons";
import { Separator } from "../ui/separator";
import { AllAssets } from "./allAssets";
import { DeleteAssetContent } from "./deleteAsset";
import { SearchBar } from "./searchbar";

export function MediaPageContent() {
  const [searchParams, setSearchParams] = useQueryStates(
    {
      order: parseAsStringLiteral(["asc", "desc"] as const).withDefault("desc"),
      page: parseAsInteger.withDefault(1),
      q: parseAsString.withDefault(""),
      sort: parseAsStringLiteral([
        "name",
        "size",
        "createdAt",
      ] as const).withDefault("createdAt"),
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

  const [selected, setSelected] = useState<Asset[]>([]);
  const [open, setOpen] = useState(false);

  const { data, isFetching, isLoading, isPlaceholderData } =
    api.attachment.getAll.useQuery(
      {
        fileType: searchParams.type,
        page: searchParams.page,
        searchQuery: searchParams.q,
        sortBy: searchParams.sort,
        sortOrder: searchParams.order,
        teamId,
      },
      {
        enabled: !!teamId,
        keepPreviousData: true,
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
      <AlertDialog onOpenChange={setOpen} open={open}>
        <DeleteAssetContent selected={selected} setShowDeleteDialog={setOpen} />
      </AlertDialog>
      <Separator className="my-4" />
      <SearchBar
        searchParams={searchParams}
        selected={selected}
        setOpen={setOpen}
        setSearchParams={setSearchParams}
      />
      <AllAssets
        assets={data.items}
        pagination={{ data, isFetching, isPlaceholderData }}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}
