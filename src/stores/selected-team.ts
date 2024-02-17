import { create } from "zustand";

import { TeamSchemaValues } from "@/schemas/team-schema";

interface SelectedTeamStore extends TeamSchemaValues {
	setName: (name: TeamSchemaValues["name"]) => void;
	setUrl: (url: TeamSchemaValues["url"]) => void;
}

const defaultValues = {
	id: "",
	name: "",
	url: "",
	image: "",
};

export const useSelectedTeamStore = create<SelectedTeamStore>()((set) => ({
	...defaultValues,
	setName: (name) => set(() => ({ name })),
	setUrl: (url) => set(() => ({ url })),
}));
