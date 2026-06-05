export function LoadingSpinner({ size = "md", className = "" }) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
  };
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} rounded-full border-ink-200 border-t-amber-500 animate-spin`}
      />
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-20 rounded-full" />
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-5/6" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
      <div className="skeleton h-4 w-24 rounded-full" />
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-10 w-3/4" />
      <div className="flex gap-4 pt-2">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-4 w-24" />
      </div>
      <div className="pt-6 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`skeleton h-4 ${i % 3 === 2 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}
