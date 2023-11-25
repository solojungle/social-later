import { create } from "zustand";

import {
	UserSchemaValues,
	userStoreDefaultValues,
} from "@/schemas/user-schema";

interface UserStore extends UserSchemaValues {
	// updateName: (name: UserState["name"]) => void;
}

const defaultValues = userStoreDefaultValues;

export const useUserStore = create<UserStore>()((set) => ({
	...defaultValues,
}));
