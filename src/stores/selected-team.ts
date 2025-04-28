import { TeamSchemaValues } from "@/schemas/team-schema";
import { create } from "zustand";

interface SelectedTeamStore extends TeamSchemaValues {
  setName: (name: TeamSchemaValues["name"]) => void;
  setUrl: (url: TeamSchemaValues["url"]) => void;
}

const defaultValues = {
  id: "",
  image: "",
  name: "",
  subscriptionStatus: "",
  url: "",
};

export const useSelectedTeamStore = create<SelectedTeamStore>()((set) => ({
  ...defaultValues,
  setName: (name) => set(() => ({ name })),
  setUrl: (url) => set(() => ({ url })),
}));
