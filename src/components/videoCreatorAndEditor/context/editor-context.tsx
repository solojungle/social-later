"use client";

import type { Caption } from "@remotion/captions";
import { createContext, ReactNode, useContext, useState } from "react";

interface GlobalStyles {
	fontFamily: string;
	fontSize: number;
	color: string;
	highlightColor: string;
	shadow: string;
	textTransform: "none" | "uppercase" | "lowercase";
	position: { x: number; y: number };
}

export interface TextCaption extends Caption {
	id: string;
}

interface EditorContextType {
	videoFile: File | null;
	videoUrl: string | null;
	captions: TextCaption[];
	selectedCaptionId: string | null;
	globalStyles: GlobalStyles;
	setVideoFile: (file: File | null) => void;
	setVideoUrl: (url: string | null) => void;
	addCaption: () => void;
	updateCaption: (id: string, updates: Partial<TextCaption>) => void;
	updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;
	deleteCaption: (id: string) => void;
	selectCaption: (id: string | null) => void;
}

const EditorContext = createContext<EditorContextType>({
	videoFile: null,
	videoUrl: null,
	captions: [],
	selectedCaptionId: null,
	globalStyles: {
		fontFamily: "Inter",
		fontSize: 24,
		color: "#FFFFFF",
		highlightColor: "#39E508",
		shadow: "none",
		textTransform: "none",
		position: { x: 50, y: 50 },
	},
	setVideoFile: () => {},
	setVideoUrl: () => {},
	addCaption: () => {},
	updateCaption: () => {},
	deleteCaption: () => {},
	selectCaption: () => {},
	updateGlobalStyles: () => {},
});

const EXAMPLE_CAPTIONS: TextCaption[] = [
	{
		id: "1",
		text: "Using",
		startMs: 40,
		endMs: 300,
		timestampMs: 200,
		confidence: null,
	},
	{
		id: "2",
		text: " Remotion's",
		startMs: 300,
		endMs: 900,
		timestampMs: 440,
		confidence: null,
	},
	{
		id: "3",
		text: " TikTok",
		startMs: 900,
		endMs: 1260,
		timestampMs: 1080,
		confidence: null,
	},
	{
		id: "4",
		text: " template,",
		startMs: 1260,
		endMs: 1950,
		timestampMs: 1600,
		confidence: null,
	},
];

export function EditorProvider({ children }: { children: ReactNode }) {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [globalStyles, setGlobalStyles] = useState<GlobalStyles>({
		fontFamily: "Inter",
		fontSize: 24,
		color: "#FFFFFF",
		highlightColor: "#39E508",
		shadow: "none",
		textTransform: "none",
		position: { x: 50, y: 50 },
	});
	const [captions, setCaptions] = useState<TextCaption[]>(EXAMPLE_CAPTIONS);
	const [selectedCaptionId, setSelectedCaptionId] = useState<string | null>(
		null,
	);

	const addCaption = () => {
		const newCaption: TextCaption = {
			id: Math.random().toString(36),
			text: "New Caption",
			startMs: 0,
			endMs: 1000,
			timestampMs: 0,
			confidence: null,
		};

		setCaptions([...captions, newCaption]);
	};

	const updateCaption = (id: string, updates: Partial<TextCaption>) => {
		setCaptions(
			captions.map((caption) =>
				caption.id === id ? { ...caption, ...updates } : caption,
			),
		);
	};

	const deleteCaption = (id: string) => {
		setCaptions(captions.filter((caption) => caption.id !== id));
		if (selectedCaptionId === id) {
			setSelectedCaptionId(null);
		}
	};

	const selectCaption = (id: string | null) => {
		setSelectedCaptionId(id);
	};

	const updateGlobalStyles = (updates: Partial<GlobalStyles>) => {
		setGlobalStyles((prev) => ({
			...prev,
			...updates,
		}));
	};

	return (
		<EditorContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				videoFile,
				videoUrl,
				captions,
				selectedCaptionId,
				globalStyles,
				setVideoFile,
				setVideoUrl,
				addCaption,
				updateCaption,
				deleteCaption,
				selectCaption,
				updateGlobalStyles,
			}}
		>
			{children}
		</EditorContext.Provider>
	);
}

export function useEditor() {
	const context = useContext(EditorContext);

	if (!context) {
		throw new Error("useEditor must be used within an EditorProvider");
	}

	return context;
}
