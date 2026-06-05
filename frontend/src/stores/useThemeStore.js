import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
 persist(
 (set, get) => ({
 theme: "light",

 toggle: () => {
 const next = get().theme === "light" ? "dark" : "light";
 set({ theme: next });
 if (next === "dark") {
 document.documentElement.classList.add("dark");
 } else {
 document.documentElement.classList.remove("dark");
 }
 },

 setTheme: (theme) => {
 set({ theme });
 if (theme === "dark") {
 document.documentElement.classList.add("dark");
 } else {
 document.documentElement.classList.remove("dark");
 }
 },
 }),
 {
 name: "theme-storage",
 onRehydrateStorage: () => (state) => {
 if (state?.theme === "dark") {
 document.documentElement.classList.add("dark");
 } else {
 document.documentElement.classList.remove("dark");
 }
 },
 },
 ),
 );

export default useThemeStore;
