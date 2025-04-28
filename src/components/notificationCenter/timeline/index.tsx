import { formatSizeBytes } from "@/components/mediaPage/allAssets";
import { Button } from "@/components/ui/button";
import { InterfaceIcons } from "@/components/ui/icons";

export function Timeline({ files }: any) {
  return (
    <div className="relative flex">
      <div className="w-full space-y-1">
        {files.map((file: any) => {
          return (
            <TimelineItem key={file.name}>
              <ImageUploads />
            </TimelineItem>
          );
        })}
      </div>
    </div>
  );
}

function ImageUploads() {
  const asset = {
    extension: "png",
    mime: "image/png",
    name: "superobnoxiousfilenamethatgetsincreasinglylongerandlonger",
    size: 123456,
    url: "images/avatar1.png",
  };

  const fileName = `${asset.name}.${asset.extension}` ?? "";

  return (
    <div className="flex">
      <img
        alt="notification"
        className="h-12 w-12 rounded-sm object-cover"
        src="images/avatar1.png"
      />
      <div className="ml-2 flex w-full items-start justify-between">
        <div className="w-full">
          <p
            className="mb-px w-48 overflow-hidden truncate text-xs font-medium"
            title={fileName}
          >
            {fileName}
          </p>
          <div className="text-xs uppercase text-muted-foreground">
            {asset.mime ?? "UNKNOWN"} - {formatSizeBytes(asset.size) ?? "0 B"}
          </div>
        </div>
        <Button
          className="shrink-0"
          onClick={() => window.open(asset.url, "_blank")}
          size="icon"
          variant="ghost"
        >
          <InterfaceIcons.Download className="h-3 w-3 shrink-0" />
        </Button>
      </div>
    </div>
  );
}

function TimelineItem({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute left-[-2.20rem] top-5 h-1.5 w-1.5 rounded-full bg-primary" />
      <div className="rounded-sm border border-border bg-primary-foreground p-1.5 text-xs">
        {children}
      </div>
    </div>
  );
}
