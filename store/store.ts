import { create } from "zustand";

type Screen = "acceuil" | "partager" | "faxai" | "archives";

interface NavState {
  currentScreen: Screen;
  setScreen: (screen: Screen) => void;
}

const useNavStore = create<NavState>((set) => ({
  currentScreen: "acceuil",
  setScreen: (screen) => set({ currentScreen: screen }),
}));

export { useNavStore };
