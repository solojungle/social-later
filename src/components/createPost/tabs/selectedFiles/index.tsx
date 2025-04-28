import { formatSizeBytes } from "@/components/mediaPage/allAssets";
import { cn } from "@/lib/utils";

export function SelectedPreview({ files }: { files: any[] | undefined }) {
  if (!files || files.length <= 0) {
    return null;
  }

  return (
    <div className="mb-4 grid grid-cols-3 gap-1">
      {files.map((file) => {
        return (
          <div
            className={cn(
              "group relative flex flex-col rounded-md border border-border",
              files.includes(file.id) && "ring-offset-px ring-2 ring-primary",
            )}
            key={file.id}
          >
            <div className="relative group-hover:cursor-pointer">
              <img
                alt={file.name}
                className="aspect-video w-full grow rounded-t-md object-cover"
                src={file.thumbnail}
              />
            </div>
            <div className="flex h-14 items-center rounded-b-md border-t border-border bg-muted p-2 group-hover:cursor-pointer">
              <div className="w-full">
                <p
                  className="mb-px truncate text-sm font-medium"
                  title={`${file.name}.${file.extension}`}
                >
                  {file.name}.{file.extension}
                </p>
                <div className="text-xs uppercase text-muted-foreground">
                  {file.mime} - {formatSizeBytes(file.size)}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
