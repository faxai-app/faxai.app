import { api } from "@/api/axios";
import { Platform } from "react-native";

export const shareResource = async (data: {
  content: string;
  type: "post" | "epreuve" | "cours";
  attachments?: any[];
  details?: any;
}) => {
  try {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("type", data.type);
    if (data.details) formData.append("details", JSON.stringify(data.details));

    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        // @ts-ignore
        formData.append("files", {
          uri:
            Platform.OS === "android"
              ? file.uri
              : file.uri.replace("file://", ""),
          type: file.type,
          name: file.name,
        });
      });
    }

    const response = await api.post("/user/share", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { data: response.data, error: null };
  } catch (error: any) {
    return { data: null, error: "Erreur serveur" };
  }
};
