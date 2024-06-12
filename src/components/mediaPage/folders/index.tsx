import { Folder } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

type Props = {
	folders: { id: number; name: string; count: number }[];
};

export function Folders({ folders }: Props) {
	return (
		<div>
			<h3 className="mb-4 font-medium">Folders</h3>
			<div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
				{folders.map((folder) => (
					<div
						key={folder.id}
						className="flex items-center rounded-sm border border-border bg-background p-2 text-xs text-foreground shadow-sm"
					>
						<Checkbox className="mr-4" />
						<Folder className="mr-4 h-6 w-6" />
						<div>
							<div className="font-medium">{folder.name}</div>
							<div className="text-muted-foreground">{folder.count} assets</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
