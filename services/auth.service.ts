import { api } from "@/api/axios";

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
  specialisation?: string;
}) => {
  try {
    const response = await api.put("/auth/complete-profile", userData);
    return { data: response.data, error: null };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la mise à jour du profil";
    return { data: null, error: message };
  }
};
