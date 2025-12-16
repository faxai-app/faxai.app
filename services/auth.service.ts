import { api } from "@/api/axios";
import { authType } from "@/types/types";

const register = async (data: authType) => api.post("/auth/register", data);

const login = async (data: authType) => api.post("/auth/login", data);

export { login, register };

