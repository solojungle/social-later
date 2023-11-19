import { create } from "zustand";

interface UserState {
	name: string;
	email: string;
	avatar: string;
	avatarFallbackInitials: string;
}

interface UserStore extends UserState {
	updateUserInfo: (data: Partial<UserState>) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
	name: "Ali Awari",
	email: "ali@seriesfi.com",
	avatar: "https://vercel.com/api/www/avatar/8qz8aKrYCnaP9NwrC7jgnLmr?&s=160",
	avatarFallbackInitials: "AA",
	updateUserInfo: (data) => set(data),
}));
