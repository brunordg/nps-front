import { CompanyFormData } from "../types/company";
import api from "./axios";


export const companieservice = {
    async list(): Promise<CompanyFormData[]> {
        try {
            const response = await api.get("/api/v1/companies");

            if (response.status !== 200) {
                console.error("Failed to list company", response);
                throw new Error("Erro ao listar empresa.")
            }

            return response.data;

        } catch (error) {
            console.error("Error in list companies:", error);
            throw error;
        }
    },

    async create(data: CompanyFormData): Promise<CompanyFormData> {

        try {
            const response = await api.post("/api/v1/companies", data);

            if (response.status !== 201) {
                console.error("Failed to create company", response);
                throw new Error("Erro ao criar empresa.")
            }

            return response.data;
        } catch (error) {
            console.error("Error in create company:", error);
            throw error;
        }
    },

    async update(id: number, data: CompanyFormData): Promise<CompanyFormData> {
        try {
            const response = await api.put(`/api/v1/companies/${id}`, data);

            if (response.status !== 200) {
                console.error("Failed to update company", response);
                throw new Error("Erro ao atualizar empresa.")
            }

            return response.data;

        } catch (error) {
            console.error("Error in update company:", error);
            throw error;
        }

    },

    async delete(id: number): Promise<void> {
        try {
            const response = await api.delete(`/api/v1/companies/${id}`);

            if (response.status !== 204) {
                console.error("Failed to delete company", response);
                throw new Error("Erro ao deletar empresa.")
            }

        } catch (error) {
            console.error("Error in delete company:", error);
            throw error;
        }
    },
};
