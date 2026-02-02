import { useAuthStore } from "@/store/store";
import { Comment, Post } from "@/types";

const API_URL = "http://192.168.8.100:5000"; // Vérifiez cette URL !

export const homeApi = {
  getFeed: async (page: number = 1, limit: number = 10): Promise<Post[]> => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        throw new Error("Token non disponible");
      }

      const url = `${API_URL}/home?page=${page}&limit=${limit}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error:", errorText); // DEBUG
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      const data = await response.json();
      if (!data.publications) {
        throw new Error("Format de réponse invalide (manque publications)");
      }

      return data.publications;
    } catch (error: any) {
      console.error("Erreur détaillée:", error.message);
      throw new Error(error.message || "Erreur chargement feed");
    }
  },

  likePost: async (
    postId: number,
  ): Promise<{ liked: boolean; count: number }> => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  bookmarkPost: async (postId: number): Promise<{ bookmarked: boolean }> => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/posts/${postId}/bookmark`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  getComments: async (postId: number): Promise<Comment[]> => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  addComment: async (postId: number, content: string): Promise<Comment> => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  getBookmarks: async (): Promise<Post[]> => {
    const token = useAuthStore.getState().token;
    const response = await fetch(`${API_URL}/bookmarks`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Erreur chargement bookmarks");
    const data = await response.json();
    return data.bookmarks;
  },
};
