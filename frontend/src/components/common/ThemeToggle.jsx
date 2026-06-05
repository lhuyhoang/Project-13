import { Sun, Moon } from "lucide-react";
import useThemeStore from "../../stores/useThemeStore";

export default function ThemeToggle() {
 const theme = useThemeStore((s) => s.theme);
 const toggle = useThemeStore((s) => s.toggle);
 const isDark = theme === "dark";

 return (
 <button
 onClick={toggle}
 className="p-2 rounded-md text-ink-300 hover:text-white hover:bg-ink-800
 transition-colors duration-200"
 aria-label="Toggle theme"
 title={isDark ? "Chuyển sang sáng" : "Chuyển sang tối"}
 >
 {isDark ? <Sun size={18} /> : <Moon size={18} />}
 </button>
 );
}
