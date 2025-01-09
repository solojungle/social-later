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

interface CaptionSettings {
	language: string;
	model: string;
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
	setCaptions: (captions: TextCaption[]) => void;
	addCaption: () => void;
	updateCaption: (id: string, updates: Partial<TextCaption>) => void;
	updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;
	deleteCaption: (id: string) => void;
	selectCaption: (id: string | null) => void;
	updateCaptionSettings: (updates: Partial<CaptionSettings>) => void;
	captionSettings: CaptionSettings;
}

const EditorContext = createContext<EditorContextType>({
	videoFile: null,
	videoUrl: null,
	captions: [],
	selectedCaptionId: null,
	globalStyles: {
		fontFamily: "",
		fontSize: 0,
		color: "",
		highlightColor: "",
		shadow: "none",
		textTransform: "none",
		position: { x: 0, y: 0 },
	},
	setVideoFile: () => {},
	setCaptions: () => {},
	setVideoUrl: () => {},
	addCaption: () => {},
	updateCaption: () => {},
	deleteCaption: () => {},
	selectCaption: () => {},
	updateGlobalStyles: () => {},
	updateCaptionSettings: () => {},
	captionSettings: {
		language: "",
		model: "",
	},
});

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
	const [captionSettings, setCaptionSettings] = useState<CaptionSettings>({
		language: "en",
		model: "whisper-1",
	});
	const [captions, setCaptions] = useState<TextCaption[]>([]);
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

	const updateCaptionSettings = (updates: Partial<CaptionSettings>) => {
		setCaptionSettings((prev) => ({
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
				selectedCaptionId,
				globalStyles,
				captions,
				setCaptions,
				setVideoFile,
				setVideoUrl,
				addCaption,
				updateCaption,
				deleteCaption,
				selectCaption,
				updateGlobalStyles,
				updateCaptionSettings,
				captionSettings,
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
