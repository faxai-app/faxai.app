import { api } from "@/api/axios";
import { useUserStore } from "@/store/store";

export const loginUser = async (credentials: {
  email: string;
  password: any;
}) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return { data: response.data, error: null };
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Erreur de connexion au serveur";
    return { data: null, error: message };
  }
};

export const registerUser = async (credentials: {
  email: string;
  password: any;
}) => {
  try {
    const response = await api.post("/auth/register", credentials);
    return { data: response.data, error: null };
  } catch (error: any) {
    const message =
      error.response?.data?.message || "Erreur de connexion au serveur";
    return { data: null, error: message };
  }
};

export const completeProfile = async (userData: {
  nom: string;
  ecole: string;
  filiere: string;
  niveau: number;
}) => {
  try {
    const response = await api.put("/auth/complete-profile", userData);

    // SI SUCCÈS : On stocke les infos dans Zustand
    // On suppose que ton serveur renvoie l'objet user mis à jour ou au moins confirme le succès
    if (response.status === 200) {
      useUserStore.getState().setUser(userData);
    }

    return { data: response.data, error: null };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la mise à jour du profil";
    return { data: null, error: message };
  }
};
