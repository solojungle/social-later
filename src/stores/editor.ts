import { TikTokToken } from "@remotion/captions";
import { create } from "zustand";

export type Caption = {
  durationMs: number;
  id: string;
  startMs: number;
  text: string;
  tokens: TikTokToken[];
};
export type CaptionToken = {
  fromMs: number;
  text: string;
  toMs: number;
};

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

const defaultCaptions: Caption[] = [
  {
    durationMs: 500,
    id: "1",
    startMs: 0,
    text: "Hey!",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "2",
    startMs: 500,
    text: "Watch this",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "3",
    startMs: 1000,
    text: "Quick tip",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "4",
    startMs: 1500,
    text: "You won't believe",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "5",
    startMs: 2000,
    text: "What happens next",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "6",
    startMs: 2500,
    text: "Mind blown",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "7",
    startMs: 3000,
    text: "No way!",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "8",
    startMs: 3500,
    text: "Check this out",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "9",
    startMs: 4000,
    text: "Crazy right?",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "10",
    startMs: 4500,
    text: "Wait for it",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "11",
    startMs: 5000,
    text: "Almost there",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "12",
    startMs: 5500,
    text: "Here it comes",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "13",
    startMs: 6000,
    text: "Boom!",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "14",
    startMs: 6500,
    text: "Did you see that?",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "15",
    startMs: 7000,
    text: "So cool",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "16",
    startMs: 7500,
    text: "Want more?",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "17",
    startMs: 8000,
    text: "Follow for more",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "18",
    startMs: 8500,
    text: "Like & share",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "19",
    startMs: 9000,
    text: "Thanks!",
    tokens: [],
  },
  {
    durationMs: 500,
    id: "20",
    startMs: 9500,
    text: "Bye! 👋",
    tokens: [],
  },
];

export const useEditorStore = create<EditorStore>((set) => ({
  addCaption: () =>
    set((state) => {
      const newCaption: Caption = {
        durationMs: 2000,
        id: Math.random().toString(36).substring(7),
        startMs: state.currentTime,
        text: "New Caption",
        tokens: [],
      };
      return {
        captions: [...state.captions, newCaption],
      };
    }),
  captions: defaultCaptions,
  captionSettings: {
    language: "en",
    model: "whisper-1",
  },
  currentTime: 0,
  deleteCaption: (id) =>
    set((state) => ({
      captions: state.captions.filter((caption) => caption.id !== id),
    })),
  globalStyles: {
    color: "#FFFFFF",
    fontFamily: "Bebas Neue",
    fontSize: 54,
    shadow: "none",
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
