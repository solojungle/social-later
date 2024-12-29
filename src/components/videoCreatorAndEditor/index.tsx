import { CaptionsPanel } from "./components/captions-panel";
import { FontPicker } from "./components/font-picker";
import { SettingsPanel } from "./components/settings-panel";
import { VideoPreview } from "./components/video-preview";

export function VideoCreatorAndEditor() {
	return (
		<main className="flex flex-col md:grid md:grid-cols-3 md:gap-2">
			<div className="relative flex flex-col md:col-span-2 md:col-start-2">
				<VideoPreview />
			</div>
			<div className="flex flex-1 flex-col md:col-start-1 md:row-start-1 md:border-r">
				<CaptionsPanel />
				<FontPicker />
				<SettingsPanel />
			</div>
		</main>
	);
}
