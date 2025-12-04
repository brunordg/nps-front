import api from "./axios";

export interface UserAccount {
    id?: number;
    name: string;
    email: string;
    phone: string;
}

export const userService = {
    getByEmail: async (email: string): Promise<UserAccount> => {
        const response = await api.get(`/api/v1/user-accounts/by-email`, {
            params: { email }
        });
        return response.data;
    },

    update: async (id: number, data: UserAccount): Promise<UserAccount> => {
        const response = await api.put(`/api/v1/user-accounts/${id}`, data);
        return response.data;
    }
};
