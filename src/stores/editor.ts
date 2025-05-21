import type { Caption } from "@remotion/captions";

import { PlayerRef } from "@remotion/player";
import { create } from "zustand";

export interface TextCaption extends Caption {
  id: string;
}

interface CaptionSettings {
  language: string;
  model: string;
}

interface EditorStore {
  addCaption: () => void;
  captions: TextCaption[];
  captionSettings: CaptionSettings;
  currentTime: number;
  deleteCaption: (id: string) => void;
  globalStyles: GlobalStyles;
  playerRef: null | PlayerRef;
  selectCaption: (id: null | string) => void;

  selectedCaptionId: null | string;
  setCaptions: (captions: TextCaption[]) => void;
  setCurrentTime: (time: number) => void;
  setPlayerRef: (ref: null | PlayerRef) => void;
  // Actions
  setVideoFile: (file: File | null) => void;
  setVideoUrl: (url: null | string) => void;
  updateCaption: (id: string, updates: Partial<TextCaption>) => void;
  updateCaptionSettings: (updates: Partial<CaptionSettings>) => void;
  updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;
  // State
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

export const useEditorStore = create<EditorStore>((set, get) => ({
  addCaption: () => {
    const { captions, currentTime } = get();
    const roundedTime = Math.round(currentTime);
    const newCaption: TextCaption = {
      confidence: null,
      endMs: roundedTime + 1000,
      id: Math.random().toString(36),
      startMs: roundedTime,
      text: "New Caption",
      timestampMs: roundedTime,
    };
    set({ captions: [...captions, newCaption] });
  },
  captions: [],
  captionSettings: {
    language: "en",
    model: "whisper-1",
  },
  currentTime: 0,
  deleteCaption: (id) =>
    set((state) => ({
      captions: state.captions.filter((caption) => caption.id !== id),
      selectedCaptionId:
        state.selectedCaptionId === id ? null : state.selectedCaptionId,
    })),
  globalStyles: {
    color: "#FFFFFF",
    fontFamily: "Inter",
    fontSize: 24,
    highlightColor: "#39E508",
    position: { x: 50, y: 50 },
    shadow: "none",
    textTransform: "none",
  },
  playerRef: null,
  selectCaption: (id) => {
    set({ selectedCaptionId: id });
    const { captions, playerRef } = get();
    if (id && playerRef) {
      const caption = captions.find((c) => c.id === id);
      if (caption) {
        const frame = (caption.startMs / 1000) * 30; // 30 fps
        playerRef.seekTo(frame);
      }
    }
  },

  selectedCaptionId: null,
  setCaptions: (captions) => set({ captions }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlayerRef: (ref) => set({ playerRef: ref }),

  // Actions
  setVideoFile: (file) => set({ videoFile: file }),

  setVideoUrl: (url) => set({ videoUrl: url }),

  updateCaption: (id, updates) =>
    set((state) => ({
      captions: state.captions.map((caption) =>
        caption.id === id ? { ...caption, ...updates } : caption,
      ),
    })),

  updateCaptionSettings: (updates) =>
    set((state) => ({
      captionSettings: { ...state.captionSettings, ...updates },
    })),

  updateGlobalStyles: (updates) =>
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...updates },
    })),

  // Initial state
  videoFile: null,

  videoUrl: null,
}));
