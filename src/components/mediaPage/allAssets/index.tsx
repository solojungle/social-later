import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import { PagePagination } from "../pagination";

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

type Props = {
	assets: any[];
	selected: any[];
	setSelected: any;
};

export function AllAssets({ assets, selected, setSelected }: Props) {
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

	// Creating a post with an already existing asset will create a duplicate
	const dedupedAssets = assets.filter(
		(v, i, a) => a.findIndex((t) => t.id === v.id) === i,
	);

	return (
		<div className="flex h-full flex-col">
			<div className="grow">
				<h3 className="mb-4 font-medium">All Assets</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
					{dedupedAssets.map((asset) => (
						<div
							key={asset.id}
							className={cn(
								"group relative flex flex-col rounded-md border border-border",
								selected.includes(asset.id) &&
									"ring-offset-px ring-2 ring-primary",
							)}
						>
							<div className="relative group-hover:cursor-pointer">
								<img
									src={asset.thumbnail}
									alt={asset.name}
									className="aspect-video w-full grow rounded-t-md object-cover"
								/>
								<div className="absolute inset-0 flex items-center justify-center rounded-t-md bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
									<div className="absolute top-0 flex w-full justify-end p-2">
										<Checkbox
											className="!h-5 !w-5 !bg-background !text-foreground"
											checked={selected.some((item) => item.id === asset.id)}
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
									<span className="select-none text-sm text-white">View</span>
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
				<PagePagination />
			</div>
		</div>
	);
}
