import { Sun, Moon } from "lucide-react";
import useThemeStore from "../../stores/useThemeStore";

export default function ThemeToggle() {
 const { theme, toggle } = useThemeStore();
 const isDark = theme === "dark";

 return (
 <button
 onClick={toggle}
 className="p-2 rounded-md text-ink-300 hover:text-white hover:bg-ink-800 transition-colors"
 aria-label="Toggle theme"
 title={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
 >
 {isDark ? <Sun size={18} /> : <Moon size={18} />}
 </button>
 );
}
