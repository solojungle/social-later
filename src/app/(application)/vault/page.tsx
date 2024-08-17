import { MediaPageContent } from "@/components/mediaPage";

export default function MediaPage() {
	return (
		<div className="!overflow-scroll p-3 pb-0">
			<div className="mb-6">
				<h3 className="text-lg font-medium">Media Library</h3>
				<p className="mb-6 text-sm text-muted-foreground">
					Manage your media files. Upload, organize, and share your media.
				</p>
			</div>
			<MediaPageContent />
		</div>
	);
}
