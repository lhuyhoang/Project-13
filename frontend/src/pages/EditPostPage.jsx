import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import PostForm from "../components/posts/PostForm";
import postService from "../services/postService";
import useAuthStore from "../stores/useAuthStore";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch bài viết khi mount
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const data = await postService.getById(id);
        const post = data.post || data;

        // AUTHORIZATION CHECK
        // Kiểm tra user có phải chủ sở hữu không
        const ownerId = post.author?._id || post.author;
        if (user?._id !== ownerId) {
          toast.error("Bạn không có quyền chỉnh sửa bài viết này");
          navigate(`/posts/${id}`, { replace: true });
          return;
        }

        setPost(post);
      } catch (err) {
        setError(err.response?.data?.message || "Không tìm thấy bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  // Handle form submit
  const handleSubmit = async (data) => {
    setIsSaving(true);
    try {
      await postService.update(id, data);
      toast.success("Đã cập nhật bài viết!");
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  // RENDER
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-body mb-4">{error}</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 page-enter">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Edit2 size={22} className="text-amber-500" />
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Chỉnh sửa bài viết
          </h1>
        </div>
        <p className="text-ink-400 font-body text-sm font-mono truncate">
          ID: {id}
        </p>
      </div>

      <div className="card p-6 md:p-8">
        {post && (
          <PostForm
            defaultValues={post}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            submitLabel="Lưu thay đổi"
          />
        )}
      </div>
    </div>
  );
}
