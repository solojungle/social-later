import { z } from "zod";
import { create } from "zustand";

export const PreferencesSchema = z.object({
	localStorage: z.boolean(),
	selectedProfile: z.string(),
	isNavbarCollapsed: z.boolean(),
});

export type PreferencesSchemaValues = z.infer<typeof PreferencesSchema>;

const defaultValues: PreferencesSchemaValues = {
	localStorage: false,
	selectedProfile: "",
	isNavbarCollapsed: false,
};

interface PreferencesStore extends PreferencesSchemaValues {
	setLocalStorage: (
		localStorage: PreferencesSchemaValues["localStorage"],
	) => void;
	setSelectedProfile: (
		selectedProfile: PreferencesSchemaValues["selectedProfile"],
	) => void;
	setNavbarCollapsed: (
		isNavbarCollapsed: PreferencesSchemaValues["isNavbarCollapsed"],
	) => void;
}

export const usePreferencesStore = create<PreferencesStore>()((set) => ({
	...defaultValues,
	setLocalStorage: (localStorage) => set(() => ({ localStorage })),
	setSelectedProfile: (selectedProfile) => set(() => ({ selectedProfile })),
	setNavbarCollapsed: (isNavbarCollapsed) => set(() => ({ isNavbarCollapsed })),
}));
