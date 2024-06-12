import { MediaPageContent } from "@/components/mediaPage";
import { ResizablePanel } from "@/components/ui/resizable";

export default function MediaPage() {
	return (
		<ResizablePanel
			id="media"
			order={2}
			className="!overflow-scroll p-3 pb-0"
			defaultSize={80}
		>
			<div className="mb-6">
				<h3 className="text-lg font-medium">Media Library</h3>
				<p className="mb-6 text-sm text-muted-foreground">
					Manage your media files. Upload, organize, and share your media.
				</p>
			</div>
			<MediaPageContent />
		</ResizablePanel>
	);
}
