import { useAuthStore } from "@/store/store";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.43.95:5000/", //10.0.2.2:3000
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
