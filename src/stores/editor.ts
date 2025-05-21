import { create } from "zustand";

interface Caption {
  endMs: number;
  id: string;
  startMs: number;
  text: string;
}

interface CaptionSettings {
  language: string;
  model: string;
}

interface EditorStore {
  addCaption: () => void;
  captions: Caption[];
  captionSettings: CaptionSettings;
  currentTime: number;
  deleteCaption: (id: string) => void;
  globalStyles: GlobalStyles;
  playerRef: HTMLVideoElement | null;
  selectCaption: (id: string) => void;
  selectedCaptionId: null | string;
  setCaptions: (captions: Caption[]) => void;
  setCurrentTime: (time: number) => void;
  setPlayerRef: (ref: HTMLVideoElement | null) => void;
  updateCaption: (id: string, updates: Partial<Caption>) => void;
  updateCaptionSettings: (settings: Partial<CaptionSettings>) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
}

interface GlobalStyles {
  color: string;
  fontFamily: string;
  fontSize: number;
  shadow: string;
  textTransform: string;
}

export const useEditorStore = create<EditorStore>((set) => ({
  addCaption: () =>
    set((state) => {
      const newCaption: Caption = {
        endMs: state.currentTime + 2000,
        id: Math.random().toString(36).substring(7),
        startMs: state.currentTime,
        text: "New Caption",
      };
      return { captions: [...state.captions, newCaption] };
    }),
  captions: [],
  captionSettings: {
    language: "en",
    model: "whisper-base",
  },
  currentTime: 0,
  deleteCaption: (id) =>
    set((state) => ({
      captions: state.captions.filter((caption) => caption.id !== id),
    })),
  globalStyles: {
    color: "#ffffff",
    fontFamily: "Inter",
    fontSize: 48,
    shadow: "medium",
    textTransform: "none",
  },
  playerRef: null,
  selectCaption: (id) => {
    let startMs: null | number = null;
    set((state) => {
      const selectedCaption = state.captions.find((c) => c.id === id);
      if (selectedCaption) {
        startMs = selectedCaption.startMs;
      }
      return { selectedCaptionId: id };
    });
    // Seek after state update
    if (startMs !== null) {
      const player = useEditorStore.getState().playerRef;
      if (player) {
        player.currentTime = startMs / 1000;
      }
    }
  },
  selectedCaptionId: null,
  setCaptions: (captions) => set({ captions }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setPlayerRef: (ref) => set({ playerRef: ref }),
  updateCaption: (id, updates) =>
    set((state) => ({
      captions: state.captions.map((caption) =>
        caption.id === id ? { ...caption, ...updates } : caption,
      ),
    })),
  updateCaptionSettings: (settings) =>
    set((state) => ({
      captionSettings: { ...state.captionSettings, ...settings },
    })),
  updateGlobalStyles: (styles) =>
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...styles },
    })),
}));
