"use client";

import type { Caption } from "@remotion/captions";

import { createContext, ReactNode, useContext, useState } from "react";

export interface TextCaption extends Caption {
  id: string;
}

interface CaptionSettings {
  language: string;
  model: string;
}

interface EditorContextType {
  addCaption: () => void;
  captions: TextCaption[];
  captionSettings: CaptionSettings;
  currentTime: number;
  deleteCaption: (id: string) => void;
  globalStyles: GlobalStyles;
  selectCaption: (id: null | string) => void;
  selectedCaptionId: null | string;
  setCaptions: (captions: TextCaption[]) => void;
  setCurrentTime: (time: number) => void;
  setVideoFile: (file: File | null) => void;
  setVideoUrl: (url: null | string) => void;
  updateCaption: (id: string, updates: Partial<TextCaption>) => void;
  updateCaptionSettings: (updates: Partial<CaptionSettings>) => void;
  updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;
  videoFile: File | null;
  videoUrl: null | string;
}

interface GlobalStyles {
  color: string;
  fontFamily: string;
  fontSize: number;
  highlightColor: string;
  position: { x: number; y: number };
  shadow: string;
  textTransform: "lowercase" | "none" | "uppercase";
}

const EditorContext = createContext<EditorContextType>({
  addCaption: () => {},
  captions: [],
  captionSettings: {
    language: "",
    model: "",
  },
  currentTime: 0,
  deleteCaption: () => {},
  globalStyles: {
    color: "",
    fontFamily: "",
    fontSize: 0,
    highlightColor: "",
    position: { x: 0, y: 0 },
    shadow: "none",
    textTransform: "none",
  },
  selectCaption: () => {},
  selectedCaptionId: null,
  setCaptions: () => {},
  setCurrentTime: () => {},
  setVideoFile: () => {},
  setVideoUrl: () => {},
  updateCaption: () => {},
  updateCaptionSettings: () => {},
  updateGlobalStyles: () => {},
  videoFile: null,
  videoUrl: null,
});

export function EditorProvider({ children }: { children: ReactNode }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<null | string>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [globalStyles, setGlobalStyles] = useState<GlobalStyles>({
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontSize: 24,
    highlightColor: "#39E508",
    position: { x: 50, y: 50 },
    shadow: "none",
    textTransform: "none",
  });
  const [captionSettings, setCaptionSettings] = useState<CaptionSettings>({
    language: "en",
    model: "whisper-1",
  });
  const [captions, setCaptions] = useState<TextCaption[]>([]);
  const [selectedCaptionId, setSelectedCaptionId] = useState<null | string>(
    null,
  );

  const addCaption = () => {
    const newCaption: TextCaption = {
      confidence: null,
      endMs: currentTime + 1000,
      id: Math.random().toString(36),
      startMs: currentTime,
      text: "New Caption",
      timestampMs: currentTime,
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

  const selectCaption = (id: null | string) => {
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
        addCaption,
        captions,
        captionSettings,
        currentTime,
        deleteCaption,
        globalStyles,
        selectCaption,
        selectedCaptionId,
        setCaptions,
        setCurrentTime,
        setVideoFile,
        setVideoUrl,
        updateCaption,
        updateCaptionSettings,
        updateGlobalStyles,
        videoFile,
        videoUrl,
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
