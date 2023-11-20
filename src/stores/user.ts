import { create } from "zustand";

interface UserState {
	name: string;
	email: string;
	url: string;
	type: string;
	avatar: string;
	avatarFallbackInitials: string;
}

interface UserStore extends UserState {
	updateUserInfo: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
	name: "Ali Awari",
	email: "ali@seriesfi.com",
	url: "solojungle",
	type: "personal",
	avatar: "https://vercel.com/api/www/avatar/8qz8aKrYCnaP9NwrC7jgnLmr?&s=160",
	avatarFallbackInitials: "AA",
	updateUserInfo: (data) => set(data),
}));
