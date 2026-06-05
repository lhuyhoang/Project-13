import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
 persist(
 (set, get) => ({
 theme: "light",

 toggle: () => {
 set({ theme: get().theme === "light" ? "dark" : "light" });
 },

 setTheme: (theme) => {
 set({ theme });
 },
 }),
 {
 name: "theme-storage",
 partialize: (state) => ({ theme: state.theme }),
 },
 ),
);

export default useThemeStore;
