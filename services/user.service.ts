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
