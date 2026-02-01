import { useAuthStore } from "@/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.8.100:5000/",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dans votre fichier api/axios.ts
api.interceptors.request.use((req) => {
  console.log("➡️ Requête:", req.method, req.url, req.data);
  return req;
});

api.interceptors.response.use(
  (res) => {
    console.log("✅ Réponse:", res.status);
    return res;
  },
  (err) => {
    console.log("❌ Erreur détaillée:", {
      message: err.message,
      code: err.code,
      config: err.config?.url,
      response: err.response?.status,
    });
    throw err;
  },
);

export { api };

