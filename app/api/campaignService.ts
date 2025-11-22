import { CampaignFormData } from "../types/campaign";
import api from "./axios";


export const campaignService = {
    async list(): Promise<CampaignFormData[]> {
        try {
            const response = await api.get("/api/v1/campaigns");

            if (response.status !== 200) {
                console.error("Failed to list campaign", response);
                throw new Error("Erro ao listar campanha.")
            }

            return response.data;

        } catch (error) {
            console.error("Error in list campaigns:", error);
            throw error;
        }
    },

    async create(data: CampaignFormData): Promise<CampaignFormData> {

        try {
            const response = await api.post("/api/v1/campaigns", data);

            if (response.status !== 201) {
                console.error("Failed to create campaign", response);
                throw new Error("Erro ao criar campanha.")
            }

            return response.data;
        } catch (error) {
            console.error("Error in create campaign:", error);
            throw error;
        }
    },

    async update(id: number, data: CampaignFormData): Promise<CampaignFormData> {
        try {
            const response = await api.put(`/api/v1/campaigns/${id}`, data);

            if (response.status !== 200) {
                console.error("Failed to update campaign", response);
                throw new Error("Erro ao atualizar campanha.")
            }

            return response.data;

        } catch (error) {
            console.error("Error in update campaign:", error);
            throw error;
        }

    },

    async delete(id: number): Promise<void> {
        try {
            const response = await api.delete(`/api/v1/campaigns/${id}`);

            if (response.status !== 204) {
                console.error("Failed to delete campaign", response);
                throw new Error("Erro ao deletar campanha.")
            }

        } catch (error) {
            console.error("Error in delete campaign:", error);
            throw error;
        }
    },
};
