import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../api/client";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        set({ token: data.access_token });
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
        await get().refreshUser();
      },

      register: async (username, email, password) => {
        const { data } = await api.post("/auth/register", { username, email, password });
        set({ token: data.access_token });
        api.defaults.headers.common["Authorization"] = `Bearer ${data.access_token}`;
        await get().refreshUser();
      },

      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common["Authorization"];
      },

      refreshUser: async () => {
        try {
          const { data } = await api.get("/users/me");
          set({ user: data });
        } catch {
          get().logout();
        }
      },
    }),
    {
      name: "habits-rpg-auth",
      partialState: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
          state.refreshUser();
        }
      },
    }
  )
);

export default useAuthStore;
