import { CaptionsPanel } from "./components/captions-panel";
import { SettingsPanel } from "./components/settings-panel";

export function VideoCreatorAndEditor() {
	return (
		<main className="flex flex-1">
			<SettingsPanel />
			<CaptionsPanel />
		</main>
	);
}
