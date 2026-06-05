import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  Edit2,
  Trash2,
  ArrowLeft,
  Clock,
  User,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import postService from "../services/postService";
import useAuthStore from "../stores/useAuthStore";
import CommentSection from "../components/comments/CommentSection";
import { PostDetailSkeleton } from "../components/common/LoadingSpinner";

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiking, setIsLiking] = useState(false);

  // Fetch bài viết khi mount hoặc id thay đổi
  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await postService.getById(id);
      setPost(data.post || data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Bài viết không tồn tại hoặc đã bị xóa.");
      } else {
        setError("Không thể tải bài viết. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // LIKE HANDLER
  const handleLike = async () => {
    if (!user) {
      toast.error("Đăng nhập để thích bài viết!");
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    try {
      const res = await postService.toggleLike(id);
      setPost((prev) => ({
        ...prev,
        likesCount: res.likesCount,
        isLiked: res.liked,
      }));
      toast.success(res.liked ? "❤️ Đã thích" : "Đã bỏ thích");
    } catch {
      toast.error("Có lỗi xảy ra. Thử lại sau.");
    } finally {
      setIsLiking(false);
    }
  };

  // DELETE HANDLER
  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này không?")) return;
    try {
      await postService.delete(id);
      toast.success("Đã xóa bài viết");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  // CHECKS
  // Kiểm tra user có phải chủ bài viết không
  const isOwner =
    user && post && (user._id === post.author?._id || user._id === post.author);

  // RENDER
  if (isLoading) return <PostDetailSkeleton />;

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-ink-500 font-body mb-4">{error}</p>
        <Link to="/" className="btn-secondary inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Về trang chủ
        </Link>
      </div>
    );
  }

  if (!post) return null;

  const formattedDate = new Date(post.createdAt).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
 const plainText = (post.content || "").replace(/<[^>]+>/g, " ").trim();
 const wordCount = plainText.split(/\s+/).filter(Boolean).length || 0;
 const readMinutes = Math.max(1, Math.ceil(wordCount / 250));

  return (
 <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 page-enter">
 {/* BACK BUTTON */}
 <Link
 to="/"
 className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-800 dark:hover:text-ink-100 mb-6 transition-colors"
 >
 <ArrowLeft size={16} /> Về trang chủ
 </Link>

 {/* POST HEADER */}
 <article className="bg-white dark:bg-ink-900 rounded-xl p-4 sm:p-6
 border border-ink-100 dark:border-ink-800">
 {/* Cover Image */}
 {post.coverImage && (
 <div className="mb-6 -mx-4 sm:mx-0 sm:rounded-xl overflow-hidden">
 <img
 src={
 post.coverImage.startsWith("/uploads")
 ? `${(import.meta.env.VITE_API_URL || "http://localhost:5000").replace("/api", "")}${post.coverImage}`
 : post.coverImage
 }
 alt={post.title}
 className="w-full max-h-96 object-cover"
 />
 </div>
 )}

 {/* Category */}
 {post.category && (
 <span className="badge mb-4 inline-block">{post.category}</span>
 )}

 {/* Title */}
 <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-950 dark:text-ink-50 leading-tight mb-4">
 {post.title}
 </h1>

 {/* Meta info */}
 <div className="flex flex-wrap items-center gap-4 text-sm text-ink-500 dark:text-ink-400 font-body mb-8 pb-6 border-b border-ink-200 dark:border-ink-800">
 <span className="flex items-center gap-1.5">
 <User size={14} />
 <strong className="text-ink-700 dark:text-ink-200">
 {post.author?.username || post.author || "Ẩn danh"}
 </strong>
 </span>
 <span className="flex items-center gap-1.5">
 <Calendar size={14} />
 {formattedDate}
 </span>
 <span className="flex items-center gap-1.5">
 <Clock size={14} />
 {readMinutes} phút đọc
 </span>
 </div>

 {/* CONTENT */}
 <div
 className="prose prose-ink dark:prose-invert max-w-none font-body leading-8
 text-ink-800 dark:text-ink-200 text-base"
 dangerouslySetInnerHTML={{ __html: post.content }}
 />

 {/* TAGS */}
 {post.tags?.length > 0 && (
 <div className="flex flex-wrap gap-2 mt-8">
 {post.tags.map((tag) => (
 <span
 key={tag}
 className="px-2.5 py-1 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 rounded-md text-xs font-mono"
 >
 #{tag}
 </span>
 ))}
 </div>
 )}

 {/* ACTION BAR */}
 <div className="flex items-center justify-between mt-10 pt-6 border-t border-ink-200 dark:border-ink-800">
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body
                       border transition-all active:scale-95 ${
                         post.isLiked
                           ? "border-red-300 bg-red-50 text-red-600"
                           : "border-ink-200 text-ink-600 hover:border-red-300 hover:text-red-500"
                       } disabled:opacity-60`}
          >
            <Heart
              size={16}
              className={post.isLiked ? "fill-red-500 text-red-500" : ""}
            />
            <span>{post.likesCount ?? post.likes?.length ?? 0}</span>
            <span>{post.isLiked ? "Đã thích" : "Thích"}</span>
          </button>

          {/* Edit/Delete (chỉ chủ sở hữu) */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm
                           border border-ink-200 text-ink-600 hover:bg-ink-100 transition-colors"
              >
                <Edit2 size={14} /> Sửa
              </Link>
              <button
                onClick={handleDelete}
                className="btn-danger flex items-center gap-1.5 text-sm"
              >
                <Trash2 size={14} /> Xóa
              </button>
            </div>
          )}
        </div>
      </article>

      {/* COMMENT SECTION */}
      <CommentSection
        postId={post._id}
        postAuthorId={post.author?._id || post.author}
      />
    </div>
  );
}
