"use client";

import { getVideoMetadata } from "@remotion/media-utils";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";

import { InterfaceIcons } from "../ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CaptionsPanel } from "./components/captions-panel";
import { FontStyles } from "./components/font-styles";
import { SettingsPanel } from "./components/settings-panel";
import { VideoPreview } from "./components/video-preview";
import { EditorProvider } from "./context/editor-context";

export function VideoCreatorAndEditor() {
	const [fileId] = useQueryState("file");
	const [metadata, setMetadata] = useState<{
		width: number;
		height: number;
		durationInSeconds: number;
	}>();
	const fps = 30;

	const { data, isLoading } = api.file.get.useQuery(
		{
			id: fileId ?? "",
		},
		{
			enabled: !!fileId,
		},
	);

	useEffect(() => {
		async function loadMetadata() {
			if (data?.url) {
				const meta = await getVideoMetadata(data.url);
				setMetadata(meta);
			}
		}
		loadMetadata();
	}, [data?.url]);

	if (isLoading || !data || !metadata) {
		return (
			<div className="flex h-96 flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<EditorProvider>
			<main className="flex h-full flex-col p-4 md:grid md:grid-cols-3">
				<div className="flex max-h-full items-start md:col-span-2 md:p-4">
					{!data && isLoading ? (
						<div className="flex h-96 items-center justify-center">
							<div className="text-center">
								<h3 className="text-lg font-medium">No file selected</h3>
								<p className="text-sm text-muted-foreground">
									Please select a file to edit.
								</p>
							</div>
						</div>
					) : (
						<VideoPreview
							src={data.url}
							width={metadata.width}
							height={metadata.height}
							fps={fps}
							duration={Math.floor(metadata.durationInSeconds * fps)}
						/>
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
