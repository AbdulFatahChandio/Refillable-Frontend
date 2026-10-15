
import { create } from "zustand";
import { User } from "../ts-types/generated";

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
    isLoggedIn: boolean;
}

export const useUserStore = create<UserState>((set) => ({
    user: null,
    isLoggedIn: false,

    setUser: (user) => set({ user, isLoggedIn: true }),

    clearUser: () => set({ user: null, isLoggedIn: false }),
}));