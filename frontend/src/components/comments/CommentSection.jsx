import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, MessageSquare, Send } from "lucide-react";
import toast from "react-hot-toast";
import commentService from "../../services/commentService";
import useAuthStore from "../../stores/useAuthStore";
import { LoadingSpinner } from "../common/LoadingSpinner";
import Avatar from "../common/Avatar";

// Validation schema cho form comment
const commentSchema = z.object({
  content: z
    .string()
    .min(2, "Bình luận phải có ít nhất 2 ký tự")
    .max(1000, "Bình luận không được vượt quá 1000 ký tự"),
});

export default function CommentSection({ postId, postAuthorId }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore((s) => s.user);

  // Fetch comments khi mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const data = await commentService.getByPost(postId);
      // Backend trả { success, comments: [...] }
      setComments(data.comments || []);
    } catch {
      toast.error("Không thể tải bình luận");
    } finally {
      setIsLoading(false);
    }
  };

  // Form hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(commentSchema) });

  // Submit comment mới
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await commentService.create(postId, data);
      // Thêm comment mới vào đầu list
      setComments((prev) => [res.comment || res, ...prev]);
      reset(); // Clear form
      toast.success("Đã thêm bình luận");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm bình luận thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa comment
  const handleDelete = async (commentId) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    try {
      await commentService.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Đã xóa bình luận");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa bình luận thất bại");
    }
  };

  // Kiểm tra quyền xóa comment (chỉ chủ comment hoặc chủ post mới có quyền)
  const canDelete = (comment) => {
    if (!user) return false;
    return (
      user._id === comment.author?._id ||
      user._id === comment.author ||
      user._id === postAuthorId
    );
  };

  return (
    <section className="mt-10 pt-8 border-t border-ink-200">
      <h3 className="font-display text-2xl font-semibold text-ink-900 mb-6 flex items-center gap-2">
        <MessageSquare size={22} className="text-amber-500" />
        Bình luận ({comments.length})
      </h3>

      {/*  COMMENT FORM */}
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="flex gap-3 items-start">
            {/* Avatar */}
            <Avatar
              src={user.avatar}
              name={user.username}
              size="sm"
              className="mt-1"
            />
            <div className="flex-1 space-y-2">
              <textarea
                {...register("content")}
                rows={3}
                placeholder="Viết bình luận của bạn..."
                className={`input-field resize-none ${errors.content ? "input-error" : ""}`}
              />
              {errors.content && (
                <p className="text-xs text-red-500">{errors.content.message}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 text-sm py-2"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send size={14} />
                )}
                {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-ink-100 rounded-lg text-sm text-ink-600 text-center">
          <a
            href="/login"
            className="text-amber-600 font-medium hover:underline"
          >
            Đăng nhập
          </a>{" "}
          để tham gia bình luận
        </div>
      )}

      {/* COMMENT LIST */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-ink-400 py-8 font-body">
          Chưa có bình luận nào. Hãy là người đầu tiên! 💬
        </p>
      ) : (
        <ul className="space-y-5">
          {comments.map((comment) => (
            <li key={comment._id} className="flex gap-3">
              {/* Avatar */}
              <Avatar
                src={comment.author?.avatar}
                name={comment.author?.username}
                size="sm"
                className="mt-0.5"
              />

              <div className="flex-1">
                {/* Author + Date */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink-800">
                      {comment.author?.username || "Người dùng"}
                    </span>
                    <time className="text-xs text-ink-400">
                      {new Date(comment.createdAt).toLocaleDateString("vi-VN")}
                    </time>
                  </div>

                  {/* Nút xóa (chỉ hiện nếu có quyền) */}
                  {canDelete(comment) && (
                    <button
                      onClick={() => handleDelete(comment._id)}
                      className="text-ink-300 hover:text-red-500 transition-colors p-1 rounded"
                      title="Xóa bình luận"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="text-sm text-ink-700 font-body leading-relaxed whitespace-pre-line">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
