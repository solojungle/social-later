import { PagePagination } from "../pagination";

type Props = {
	assets: any[];
};

function formatSizeBytes(sizeBytes: any) {
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

export function AllAssets({ assets }: Props) {
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
		<div>
			<div>
				<h3 className="mb-4 font-medium">All Assets</h3>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{assets.map((asset) => (
						<div
							key={asset.id}
							className="flex flex-col rounded-md border border-border"
						>
							<img
								src={asset.thumbnail}
								alt={asset.name}
								className="aspect-video w-full grow rounded-t-md object-cover"
							/>
							<div className="flex h-14 items-center rounded-b-md border-t border-border bg-muted p-2">
								<div className="w-full">
									<div className="mb-px text-sm font-medium">
										{asset.name}.{asset.extension}
									</div>
									<div className="text-xs uppercase text-muted-foreground">
										{asset.mime} - {formatSizeBytes(asset.size)}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="my-8">
				<PagePagination />
			</div>
		</div>
	);
}
