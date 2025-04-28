import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsStringLiteral, useQueryState } from "nuqs";

export function FiltersList() {
  return (
    <div className="flex items-center space-x-2">
      <SortBy />
      <FilterBy />
    </div>
  );
}

function FilterBy() {
  const [type, setType] = useQueryState(
    "type",
    parseAsStringLiteral(["all", "video", "image"] as const).withDefault("all"),
  );

  return (
    <div className="flex items-center space-x-2">
      <Select
        onValueChange={(value: "all" | "image" | "video") => setType(value)}
        value={type}
      >
        <SelectTrigger className="h-9 w-9 md:w-auto">
          <SelectValue placeholder="Filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="image">Image</SelectItem>
          <SelectItem value="video">Video</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function SortBy() {
  const [sort, setSort] = useQueryState("sort", {
    defaultValue: "createdAt",
  });

  return (
    <div className="flex items-center space-x-2">
      <Select onValueChange={(value) => setSort(value)} value={sort}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Created At</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="size">Size</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
