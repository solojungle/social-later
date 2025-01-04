"use client";

import { useQueryState } from "nuqs";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CaptionsPanel } from "./components/captions-panel";
import { FontStyles } from "./components/font-styles";
import { SettingsPanel } from "./components/settings-panel";
import { VideoPreview } from "./components/video-preview";
import { EditorProvider } from "./context/editor-context";

export function VideoCreatorAndEditor() {
	const [fileId] = useQueryState("file");
	return (
		<EditorProvider>
			<main className="flex flex-col md:grid md:grid-cols-3">
				{!fileId ? (
					<div className="flex h-96 items-center justify-center">
						<div className="text-center">
							<h3 className="text-lg font-medium">No file selected</h3>
							<p className="text-sm text-muted-foreground">
								Please select a file to edit.
							</p>
						</div>
					</div>
				) : (
					<div className="relative flex flex-col p-4 md:col-span-2 md:col-start-2">
						<VideoPreview src={fileId} />
					</div>
				)}
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
