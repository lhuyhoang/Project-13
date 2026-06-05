const sizeMap = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-20 h-20 text-3xl",
  xl: "w-32 h-32 text-5xl",
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
}) {
  const sizeClass = sizeMap[size] || sizeMap.md;
  const initial = (name?.[0] || "?").toUpperCase();

  // Nếu src là path tương đối bắt đầu bằng /uploads → nối với baseURL backend
  const fullSrc = src?.startsWith("/uploads")
    ? `${API_BASE.replace("/api", "")}${src}`
    : src;

  if (fullSrc) {
    return (
      <img
        src={fullSrc}
        alt={name}
        className={`${sizeClass} rounded-full object-cover bg-amber-500 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-amber-500 flex items-center
 justify-center font-display font-bold text-ink-950 ${className}`}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
