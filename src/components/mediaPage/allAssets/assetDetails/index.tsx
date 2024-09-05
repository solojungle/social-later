import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function Content({ asset }: { asset: any }) {
	if (asset.type === "image") {
		return (
			<img
				src={asset.url}
				alt={asset.name}
				className="aspect-video w-full grow rounded-t-md object-cover"
			/>
		);
	}

	return (
		// eslint-disable-next-line jsx-a11y/media-has-caption
		<video
			src={asset.url}
			controls
			className="aspect-video w-full grow rounded-t-md object-cover"
		/>
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
