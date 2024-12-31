"use client";

import { createContext, ReactNode, useContext, useState } from "react";

interface Caption {
	id: string;
	startTime: string;
	endTime: string;
	text: string;
}

interface GlobalStyles {
	fontFamily: string;
	fontSize: number;
	color: string;
	shadow: string;
	textTransform: "none" | "uppercase" | "lowercase";
	position: { x: number; y: number };
}

interface EditorContextType {
	videoFile: File | null;
	videoUrl: string | null;
	captions: Caption[];
	selectedCaptionId: string | null;
	globalStyles: GlobalStyles;
	setVideoFile: (file: File | null) => void;
	setVideoUrl: (url: string | null) => void;
	addCaption: () => void;
	updateCaption: (id: string, updates: Partial<Caption>) => void;
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

export function EditorProvider({ children }: { children: ReactNode }) {
	const [videoFile, setVideoFile] = useState<File | null>(null);
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [globalStyles, setGlobalStyles] = useState<GlobalStyles>({
		fontFamily: "Inter",
		fontSize: 24,
		color: "#FFFFFF",
		shadow: "none",
		textTransform: "none",
		position: { x: 50, y: 50 },
	});
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
