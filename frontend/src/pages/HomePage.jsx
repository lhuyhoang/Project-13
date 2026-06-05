import { useState, useCallback } from "react";
import { Search, Filter, FileX } from "lucide-react";
import PostCard from "../components/posts/PostCard";
import Pagination from "../components/common/Pagination";
import { PostCardSkeleton } from "../components/common/LoadingSpinner";
import usePosts from "../hooks/usePosts";

// Danh sách category để filter
const CATEGORIES = [
  "Tất cả",
  "Công nghệ",
  "Lập trình",
  "Thiết kế",
  "Kinh doanh",
  "Khoa học",
  "Giáo dục",
  "Sức khỏe",
  "Du lịch",
  "Ẩm thực",
  "Khác",
];

export default function HomePage() {
  const {
    posts,
    isLoading,
    error,
    page,
    totalPages,
    total,
    setPage,
    setSearch,
    setCategory,
    search,
    category,
  } = usePosts({ limit: 9 });

  // Input state riêng để debounce search
  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchInput(val);
      setSearch(val);
    },
    [setSearch],
  );

  const handleCategorySelect = (cat) => {
    setCategory(cat === "Tất cả" ? "" : cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen page-enter">
      {/* HERO HEADER */}
      <header className="bg-ink-950 text-ink-50 py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-3">
            Khám phá tri thức,
            <span className="text-amber-400"> chia sẻ ý tưởng</span>
          </h1>
          <p className="text-ink-300 font-body text-lg max-w-xl mx-auto mb-8">
            Nền tảng viết blog cho cộng đồng học tập và sáng tạo nội dung.
          </p>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-ink-800 border border-ink-700
                         text-ink-100 placeholder:text-ink-500 focus:outline-none
                         focus:ring-2 focus:ring-amber-500 font-body text-sm transition-all"
            />
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── CATEGORY FILTER ──────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <Filter size={15} className="text-ink-400 flex-shrink-0" />
          {CATEGORIES.map((cat) => {
            const isActive = cat === "Tất cả" ? !category : cat === category;
            return (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-body transition-all ${
                  isActive
                    ? "bg-ink-900 text-white shadow-sm"
                    : "bg-white border border-ink-200 text-ink-600 hover:border-ink-400"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* RESULT COUNT */}
        {!isLoading && (
          <p className="text-sm text-ink-400 mb-5 font-body">
            {total} bài viết
            {category && ` trong danh mục "${category}"`}
            {search && ` khớp với "${search}"`}
          </p>
        )}

        {/* POST GRID */}
        {isLoading ? (
          // Skeleton loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <p className="text-red-500 font-body">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 btn-secondary text-sm"
            >
              Thử lại
            </button>
          </div>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="text-center py-20">
            <FileX size={48} className="text-ink-300 mx-auto mb-4" />
            <p className="font-display text-xl text-ink-500 mb-2">
              Không tìm thấy bài viết nào
            </p>
            <p className="text-sm text-ink-400 font-body">
              {search || category
                ? "Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm"
                : "Chưa có bài viết nào được đăng"}
            </p>
          </div>
        ) : (
          // Post grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!isLoading && !error && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
