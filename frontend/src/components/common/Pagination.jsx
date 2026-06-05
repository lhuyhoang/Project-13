import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null; // Không hiển thị nếu chỉ có 1 trang

  // Tính mảng số trang hiển thị (tối đa 5 nút)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, "...");
    else rangeWithDots.push(1);

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1)
      rangeWithDots.push("...", totalPages);
    else if (totalPages > 1) rangeWithDots.push(totalPages);

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center gap-1.5 py-6">
      {/* Nút Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-body
                   border border-ink-200 text-ink-600 hover:bg-ink-100
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        Trước
      </button>

      {/* Số trang */}
      {getPageNumbers().map((pageNum, index) => (
        <span key={index}>
          {pageNum === "..." ? (
            <span className="px-2 text-ink-400 text-sm">…</span>
          ) : (
            <button
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-md text-sm font-body transition-colors ${
                pageNum === currentPage
                  ? "bg-ink-900 text-white font-medium"
                  : "border border-ink-200 text-ink-600 hover:bg-ink-100"
              }`}
            >
              {pageNum}
            </button>
          )}
        </span>
      ))}

      {/* Nút Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-body
                   border border-ink-200 text-ink-600 hover:bg-ink-100
                   disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Sau
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
