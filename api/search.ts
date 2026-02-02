import { useAuthStore } from "@/store/store";
import { Post } from "@/types";

const API_URL = "http://192.168.8.100:5000";

export interface SearchResult {
  posts: Post[];
  files: {
    id: number;
    fileName: string;
    fileType: string;
    resourceId: number;
    resourceTitle?: string;
    resourceType: string;
    authorName: string;
  }[];
  users: {
    id: number;
    name: string;
    profilePicture?: string;
    niveau?: number;
    filiere?: string;
  }[];
}

export const searchApi = {
  globalSearch: async (query: string): Promise<SearchResult> => {
    const token = useAuthStore.getState().token;
    const url = `${API_URL}/search?q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Réponse serveur:", errorText); // ← Ceci montrera la vraie erreur
        throw new Error(
          `HTTP ${response.status}: ${errorText.substring(0, 100)}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      throw error;
    }
  },
};
