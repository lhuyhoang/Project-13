import { Link } from "react-router-dom";
import { Heart, MessageCircle, Clock, User } from "lucide-react";

export default function PostCard({ post }) {
  // Cắt nội dung để preview (loại bỏ HTML tags nếu content là HTML)
  const previewContent =
    post.content
      ?.replace(/<[^>]+>/g, "") // strip HTML tags
      .slice(0, 150) + (post.content?.length > 150 ? "…" : "");

  // Format ngày tháng
  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const wordCount = post.content?.split(/\s+/).length || 0;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 250));

  return (
    <article className="card p-5 flex flex-col gap-3 group animate-slide-up">
      {/* Header: Category + Date */}
      <div className="flex items-center justify-between">
        {post.category ? (
          <span className="badge">{post.category}</span>
        ) : (
          <span className="badge bg-ink-100 text-ink-500 border-ink-200">
            Chung
          </span>
        )}
        <time
          className="text-xs text-ink-400 font-body"
          dateTime={post.createdAt}
        >
          {formattedDate}
        </time>
      </div>

      {/* Title */}
      <Link to={`/posts/${post._id}`}>
        <h2
          className="font-display text-xl font-semibold text-ink-900 leading-snug
                       group-hover:text-amber-600 transition-colors line-clamp-2"
        >
          {post.title}
        </h2>
      </Link>

      {/* Preview content */}
      <p className="text-sm text-ink-500 font-body leading-relaxed line-clamp-3 flex-1">
        {previewContent || "Không có nội dung xem trước."}
      </p>

      {/* Footer: Author + Stats */}
      <div className="flex items-center justify-between pt-2 border-t border-ink-100">
 {/* Author */}
 <div className="flex items-center gap-1.5 text-xs text-ink-500">
 <User size={13} />
 <span className="font-medium text-ink-700">
 {post.author?.username || post.author || "Ẩn danh"}
 </span>
 </div>

        {/* Stats */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Clock size={12} />
            {readMinutes} phút đọc
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Heart size={12} className="text-red-400" />
            {/* Backend trả `likeCount` (virtual) hoặc `likesCount` (toggleLike). Fallback cả 2. */}
            {post.likeCount ?? post.likesCount ?? post.likes?.length ?? 0}
          </span>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <MessageCircle size={12} className="text-blue-400" />
            {post.commentsCount ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}
