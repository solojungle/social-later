import { create } from "zustand";

import { userDefaultValues, UserSchemaValues } from "@/schemas/user-schema";

interface UserStore extends UserSchemaValues {
	// updateName: (name: UserState["name"]) => void;
}

const defaultValues = userDefaultValues;

export const useUserStore = create<UserStore>()((set) => ({
	...defaultValues,
}));
