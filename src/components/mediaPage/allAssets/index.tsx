import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Asset } from "@/schemas/file-schema";
import { parseAsInteger, useQueryState } from "nuqs";
import { useState } from "react";

import { PagePagination } from "../pagination";
import { AssetDetails } from "./assetDetails";

type Props = {
  assets: Asset[];
  pagination: any;
  selected: Asset[];
  setSelected: (assets: Asset[]) => void;
};

export function AllAssets({
  assets,
  pagination,
  selected,
  setSelected,
}: Props) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  if (!assets || assets.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium">No assets found</h3>
          <p className="text-sm text-muted-foreground">
            Please upload some assets to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="grow">
        <h3 className="mb-4 font-medium">All Assets</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
          {assets.map((asset) => (
            <div
              className={cn(
                "group relative flex flex-col rounded-md border border-border",
                selected.some((item) => item.id === asset.id) &&
                  "ring-offset-px ring-2 ring-primary",
              )}
              key={asset.id}
            >
              <div className="relative group-hover:cursor-pointer">
                <AssetPreview asset={asset} />
                <div className="absolute inset-0 flex items-center justify-center rounded-t-md bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute top-0 flex w-full justify-end p-2">
                    <Checkbox
                      checked={selected.some((item) => item.id === asset.id)}
                      className="!h-5 !w-5 !bg-background !text-foreground"
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelected([...selected, asset]);
                        } else {
                          setSelected(
                            selected.filter((item) => item.id !== asset.id),
                          );
                        }
                      }}
                    />
                  </div>
                  <AssetDetails asset={asset} />
                </div>
              </div>
              <div className="flex h-14 items-center rounded-b-md border-t border-border bg-muted p-2 group-hover:cursor-pointer">
                <div className="w-full">
                  <p
                    className="mb-px truncate text-sm font-medium"
                    title={`${asset.name}.${asset.extension}`}
                  >
                    {asset.name}.{asset.extension}
                  </p>
                  <div className="text-xs uppercase text-muted-foreground">
                    {asset.mime} - {formatSizeBytes(asset.size)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0">
        <PagePagination
          loading={pagination.isFetching}
          onChange={setPage}
          page={page}
          total={pagination.data.pagination.pages}
        />
      </div>
    </div>
  );
}

export function formatSizeBytes(sizeBytes: any) {
  if (sizeBytes >= 1073741824) {
    // 1 GB = 1,073,741,824 bytes
    const sizeGB = sizeBytes / 1073741824;
    return `${sizeGB.toFixed(1)} GB`;
  }
  if (sizeBytes >= 1048576) {
    // 1 MB = 1,048,576 bytes
    const sizeMB = sizeBytes / 1048576;
    return `${sizeMB.toFixed(1)} MB`;
  }
  if (sizeBytes >= 1024) {
    // 1 KB = 1,024 bytes
    const sizeKB = sizeBytes / 1024;
    return `${sizeKB.toFixed(1)} KB`;
  }
  return `${sizeBytes} bytes`;
}

function AssetPreview({ asset }: { asset: Asset }) {
  const [url, setUrl] = useState(asset.thumbnail ?? asset.url);

  return (
    <img
      alt={asset.name}
      className="aspect-video w-full grow rounded-t-md object-cover"
      onError={() => {
        if (asset.type === "image") {
          return setUrl(asset.url);
        }

        return setUrl("images/videoPlaceholder.png");
      }}
      src={url}
    />
  );
}
