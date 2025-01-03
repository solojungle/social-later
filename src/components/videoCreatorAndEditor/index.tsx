import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CaptionsPanel } from "./components/captions-panel";
import { FontStyles } from "./components/font-styles";
import { SettingsPanel } from "./components/settings-panel";
import { VideoPreview } from "./components/video-preview";
import { EditorProvider } from "./context/editor-context";

export function VideoCreatorAndEditor() {
	return (
		<EditorProvider>
			<main className="flex flex-col md:grid md:grid-cols-3">
				<div className="relative flex flex-col p-4 md:col-span-2 md:col-start-2">
					<VideoPreview />
				</div>
				<div className="flex flex-1 flex-col p-4 md:col-start-1 md:row-start-1 md:border-r">
					<Tabs defaultValue="captions" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="captions">Captions</TabsTrigger>
							<TabsTrigger value="font">Font</TabsTrigger>
							<TabsTrigger value="settings">Settings</TabsTrigger>
						</TabsList>
						<TabsContent value="captions">
							<CaptionsPanel />
						</TabsContent>
						<TabsContent value="font">
							<FontStyles />
						</TabsContent>
						<TabsContent value="settings">
							<SettingsPanel />
						</TabsContent>
					</Tabs>
				</div>
			</main>
		</EditorProvider>
	);
}
