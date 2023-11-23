import { create } from "zustand";

interface UserState {
	id: string;
	name: string;
	email: string;
	url: string;
	type: string;
	avatar: string;
	avatarFallbackInitials: string;
}

interface UserStore extends UserState {
	// updateName: (name: UserState["name"]) => void;
}

const defaultValues: UserState = {
	id: "",
	name: "",
	email: "",
	url: "",
	type: "",
	avatar: "",
	avatarFallbackInitials: "",
};

export const useUserStore = create<UserStore>()((set) => ({
	...defaultValues,
}));
