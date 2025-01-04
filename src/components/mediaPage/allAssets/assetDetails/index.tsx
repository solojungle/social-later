import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Content({ asset }: { asset: any }) {
	const styleString =
		"max-h-[90vh] w-full grow rounded-md border border-border bg-transparent/70 object-contain";

	if (asset.type === "image") {
		return <img src={asset.url} alt={asset.name} className={styleString} />;
	}

	return (
		// eslint-disable-next-line jsx-a11y/media-has-caption
		<video src={asset.url} controls className={styleString} />
	);
}

export function AssetDetails({ asset }: any) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant="link"
					className="h-full w-full select-none text-sm text-white hover:no-underline"
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
