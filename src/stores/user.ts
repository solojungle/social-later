import {
  UserSchemaValues,
  userStoreDefaultValues,
} from "@/schemas/user-schema";
import { create } from "zustand";

interface UserStore extends UserSchemaValues {
  setImage: (image: UserSchemaValues["image"]) => void;
  setName: (name: UserSchemaValues["name"]) => void;
  setUrl: (url: UserSchemaValues["url"]) => void;
}

const defaultValues = userStoreDefaultValues;

export const useUserStore = create<UserStore>()((set) => ({
  ...defaultValues,
  setImage: (image) => set(() => ({ image })),
  setName: (name) => set(() => ({ name })),
  setUrl: (url) => set(() => ({ url })),
}));
