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
    const response = await fetch(
      `${API_URL}/api/search?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) throw new Error("Erreur de recherche");
    return response.json();
  },
};
