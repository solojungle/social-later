import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export function AssetDetails({ asset }: any) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-full w-full select-none text-sm text-white hover:no-underline"
          variant="link"
        >
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
        <Content asset={asset} />
      </DialogContent>
    </Dialog>
  );
}

function Content({ asset }: { asset: any }) {
  const styleString =
    "max-h-[90vh] w-full grow rounded-md border border-border bg-transparent/70 object-contain";

  if (asset.type === "image") {
    return <img alt={asset.name} className={styleString} src={asset.url} />;
  }

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video className={styleString} controls src={asset.url} />
  );
}
