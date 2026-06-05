import { create } from "zustand";
import { persist } from "zustand/middleware";
import authService from "../services/authService";

const useAuthStore = create(
  persist(
    (set, get) => ({
      // STATE
      user: null,
      token: null,
      isLoading: false,
      error: null,

      isAuthenticated: () => !!get().token,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.login(credentials);
          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
          localStorage.setItem("token", data.token);
          return data;
        } catch (err) {
          const message = err.response?.data?.message || "Đăng nhập thất bại";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authService.register(userData);
          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });
          localStorage.setItem("token", data.token);
          return data;
        } catch (err) {
          const message = err.response?.data?.message || "Đăng ký thất bại";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem("token");
        set({ user: null, token: null, error: null });
      },

      updateUser: (updatedUser) => {
        set({ user: updatedUser });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // key trong localStorage
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);

export default useAuthStore;
