import { PagePagination } from "../pagination";

type Props = {
	assets: { id: number; name: string; type: string; size: string }[];
};

export function AllAssets({ assets }: Props) {
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
								src="https://picsum.photos/200"
								alt={asset.name}
								className="aspect-video w-full grow rounded-t-md object-cover"
							/>
							<div className="flex h-14 items-center rounded-b-md border-t border-border bg-muted p-2">
								<div className="w-full">
									<div className="mb-px text-sm font-medium">{asset.name}</div>
									<div className="text-xs uppercase text-muted-foreground">
										{asset.type} - {asset.size}
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
