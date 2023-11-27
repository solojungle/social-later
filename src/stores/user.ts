import { create } from "zustand";

import {
	UserSchemaValues,
	userStoreDefaultValues,
} from "@/schemas/user/user-schema";

interface UserStore extends UserSchemaValues {
	setName: (name: UserSchemaValues["name"]) => void;
	setUrl: (url: UserSchemaValues["url"]) => void;
}

const defaultValues = userStoreDefaultValues;

export const useUserStore = create<UserStore>()((set) => ({
	...defaultValues,
	setName: (name) => set(() => ({ name })),
	setUrl: (url) => set(() => ({ url })),
}));
