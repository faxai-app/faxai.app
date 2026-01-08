import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
  profilePicture?: string;
}

interface UserState {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  lastFetched: number | null;
  setNotifications: (notifs: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  lastFetched: null,
  setNotifications: (notifs) =>
    set({ notifications: notifs, lastFetched: Date.now() }),
}));

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

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
    useUserStore.getState().clearUser();
    set({ token: null });
  },
}));

export { useNavStore };
