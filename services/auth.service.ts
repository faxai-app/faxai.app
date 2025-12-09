import { api } from "@/api/axios";
import { auth } from "@/types/types";

const register = async (data: auth) => api.post("/auth/register", data);

const login = async (data: auth) => api.post("/auth/login", data);

export { login, register };
