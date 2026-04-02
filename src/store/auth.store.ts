import { create } from 'zustand';
import axios from 'axios';

type AuthState = {
    token: string | null;
    user: any | null;
    setToken: (token: string) => Promise<void>;
    getProfile: () => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    token: localStorage.getItem("token"),
    user: null,

    setToken: async (token) => {
        localStorage.setItem("token", token);
        set({ token });
        console.log(token)
        await get().getProfile();
    },

    getProfile: async () => {
        try {
            const token = get().token;
            if (!token) return
            const res = await axios.get(`${import.meta.env.VITE_API_URL}auth/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            set({ user: res.data });
            console.log(res)
        } catch (error) {
            console.log("Get profile failed", error);
            get().logout();
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null });
    },
}));