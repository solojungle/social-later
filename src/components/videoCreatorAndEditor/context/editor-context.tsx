"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface Caption {
	id: string;
	startTime: string;
	endTime: string;
	text: string;
	style: {
		fontSize: number;
		fontFamily: string;
		color: string;
		shadow: string;
		textTransform: "none" | "uppercase" | "lowercase";
		position: { x: number; y: number };
	};
}

interface EditorContextType {
	videoFile: File | null;
	videoUrl: string | null;
	captions: Caption[];
	selectedCaptionId: string | null;
	fontFamily: string;
	setVideoFile: (file: File | null) => void;
	setVideoUrl: (url: string | null) => void;
	addCaption: () => void;
	updateCaption: (id: string, updates: Partial<Caption>) => void;
	updateAllCaptions: (style: Partial<Caption["style"]>) => void;
	deleteCaption: (id: string) => void;
	selectCaption: (id: string | null) => void;
	setFontFamily: (font: string) => void;
}

const EditorContext = createContext<EditorContextType>({
	videoFile: null,
	videoUrl: null,
	captions: [],
	selectedCaptionId: null,
	fontFamily: "Inter",
	setVideoFile: () => {},
	setVideoUrl: () => {},
	addCaption: () => {},
	updateCaption: () => {},
	deleteCaption: () => {},
	selectCaption: () => {},
	updateAllCaptions: () => {},
	setFontFamily: () => {},
});

export function EditorProvider({ children }: { children: ReactNode }) {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [fontFamily, setFontFamily] = useState<string>("Inter");
	const [captions, setCaptions] = useState<Caption[]>([]);
	const [selectedCaptionId, setSelectedCaptionId] = useState<string | null>(
		null,
	);

	const addCaption = () => {
		const newCaption: Caption = {
			id: Math.random().toString(36).substr(2, 9),
			startTime: "00:00",
			endTime: "00:05",
			text: "New Caption",
			style: {
				fontSize: 24,
				fontFamily,
				color: "#FFFFFF",
				shadow: "none",
				textTransform: "none",
				position: { x: 50, y: 50 },
			},
		};
		setCaptions([...captions, newCaption]);
	};

	const updateCaption = (id: string, updates: Partial<Caption>) => {
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

	const updateAllCaptions = (style: Partial<Caption["style"]>) => {
		setCaptions(
			captions.map((caption) => ({
				...caption,
				style: { ...caption.style, ...style },
			})),
		);
	};

	return (
		<EditorContext.Provider
			// eslint-disable-next-line react/jsx-no-constructed-context-values
			value={{
				videoFile,
				videoUrl,
				captions,
				selectedCaptionId,
				fontFamily,
				setVideoFile,
				setVideoUrl,
				addCaption,
				updateCaption,
				deleteCaption,
				selectCaption,
				updateAllCaptions,
				setFontFamily,
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
