import { ArrowRightIcon, Search } from "lucide-react";
import Link from "next/link";
import { createSerializer, parseAsString } from "nuqs";
import { useHotkeys } from "react-hotkeys-hook";

import { CreatePost } from "@/components/createPost";
import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Asset } from "@/schemas/file-schema";
import { useSocialProfilesStore } from "@/stores/social-profiles";

import { AddAssets } from "../addAssets";
import { FiltersList } from "./filtersList";

export function SearchBar({
  searchParams,
  selected,
  setOpen,
  setSearchParams,
}: {
  searchParams: any;
  selected: Asset[];
  setOpen: (open: boolean) => void;
  setSearchParams: any;
}) {
  const { currentProfileId: profileId } = useSocialProfilesStore();

  useHotkeys(
    "esc",
    () => {
      setSearchParams({
        q: "",
        sort: "createdAt",
        type: "all",
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

  const serialize = createSerializer({
    file: parseAsString,
  });

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex space-x-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="w-full pl-8"
            onChange={handleSearch}
            placeholder="Search..."
            spellCheck="false"
            value={searchParams.q}
          />
        </div>
        <FiltersList />
        <Button
          className="shrink-0"
          disabled={!selected || selected.length === 0}
          onClick={() => setOpen(true)}
          size="icon"
          variant="outline"
        >
          <InterfaceIcons.Destructive className="size-4" />
        </Button>
      </div>
      <div className="ml-4 flex space-x-2">
        <div className="flex items-center gap-2">
          <Button asChild disabled={selected.length > 1} variant="outline">
            <Link href={serialize("/creator", { file: selected[0]?.id })}>
              <span className="mr-1">Move to Captions</span>
              <ArrowRightIcon className="w-4" />
            </Link>
          </Button>
        </div>
        <CreatePost
          disabled={!profileId || selected.length === 0}
          profileId={profileId}
          scheduleDate={new Date()}
          selected={selected}
        />
        <AddAssets />
      </div>
    </div>
  );
}
