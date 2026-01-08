import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type Screen = "acceuil" | "partager" | "faxai" | "archives";

interface NavState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

interface AuthState {
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

interface UserData {
  nom: string;
  ecole: string;
  filiere: string;
  niveau: number;
}

interface UserState {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));

const useNavStore = create<NavState>((set) => ({
  currentScreen: "acceuil",
  setScreen: (screen) => set({ currentScreen: screen }),
}));

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,

  setToken: async (token) => {
    await SecureStore.setItemAsync("user_token", token);
    set({ token, isLoading: false });
  },

  loadToken: async () => {
    const token = await SecureStore.getItemAsync("user_token");
    set({ token, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("user_token");
    set({ token: null });
  },
}));

export { useNavStore };
