"use client";

import { useQueryState } from "nuqs";

import { Asset } from "@/schemas/file-schema";
import { api } from "@/trpc/react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CaptionsPanel } from "./components/captions-panel";
import { FontStyles } from "./components/font-styles";
import { SettingsPanel } from "./components/settings-panel";
import { VideoPreview } from "./components/video-preview";
import { EditorProvider } from "./context/editor-context";

export function VideoCreatorAndEditor() {
	const [fileId] = useQueryState("file");

	const { data, isLoading } = api.file.get.useQuery(
		{
			id: fileId ?? "",
		},
		{
			enabled: !!fileId,
		},
	);

	// if (isLoading) {
	// 	return <div>Loading...</div>;
	// }

	return (
		<EditorProvider>
			<main className="flex h-full flex-col p-4 md:grid md:grid-cols-3">
				<div className="flex items-center justify-center md:col-span-2">
					{!fileId && isLoading ? (
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
							<VideoPreview file={data as Asset} />
						</div>
					)}
				</div>

				<Tabs
					defaultValue="captions"
					className="w-full md:col-start-1 md:row-start-1"
				>
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
			</main>
		</EditorProvider>
	);
}
