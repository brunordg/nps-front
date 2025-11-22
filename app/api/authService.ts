import { LoginResponse } from "../types/loginResponse";
import api from "./axios";

export const authService = {
    async login(email: string, password: string): Promise<LoginResponse> {
        try {

            console.log("Attempting login with:", { email });

            const response = await api.post("/auth/login", {
                email,
                password,
            });

            console.log("Login response:", response);

            if (response.status === 401) { 
                console.error("Invalid credentials", response);
                throw new Error("Credenciais inválidas.");
            }

            if (response.status !== 200) {
                console.error("Failed login", response);
                throw new Error("Erro ao fazer login.")
            }

            return response.data;
        } catch (error: any) {
            console.error("Login error:", error.response?.data || error);
            throw new Error(error.response?.data?.title || "Erro ao fazer login");
        }
    },
};
