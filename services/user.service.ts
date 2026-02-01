import { api } from "@/api/axios";

export const uploadProfilePicture = async (formData: FormData) => {
  try {
    const response = await api.put("/user/profile-picture", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error }; //: "Impossible de télécharger l'image"
  }
};

export const shareResource = async (formData: FormData) => {
  try {
    const response = await api.post("/files", formData, {
      timeout: 30000,
    });
    return response.data;
  } catch (error: any) {
    console.error("Erreur axios:", error.response?.data || error.message);
    return { error: "Impossible de joindre le serveur" };
  }
};
