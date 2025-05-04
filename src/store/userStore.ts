// store/userStore.ts
import { create } from "zustand";
import { UserProfile } from "@/lib/types";

interface UserState {
  user: UserProfile | undefined;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: undefined }),
}));
