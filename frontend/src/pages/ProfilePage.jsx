import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Edit2,
  Trash2,
  User,
  Mail,
  BookOpen,
  PenSquare,
  Calendar,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import postService from "../services/postService";
import useAuthStore from "../stores/useAuthStore";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import Avatar from "../components/common/Avatar";

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bài viết của user hiện tại
  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setIsLoading(true);
    try {
      const data = await postService.getMyPosts({ limit: 50 });
      setMyPosts(data.posts || []);
    } catch {
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    try {
      await postService.delete(postId);
      setMyPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Đã xóa bài viết");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa thất bại");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
  };

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
      })
    : "Không rõ";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* PROFILE CARD */}
      <div className="card p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start gap-6">
        {/* Avatar lớn */}
        <Avatar
          src={user?.avatar}
          name={user?.username}
          size="lg"
          className="flex-shrink-0"
        />

        {/* Info */}
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-ink-900 mb-1">
            {user?.username}
          </h1>
          <div className="flex flex-col gap-1.5 text-sm text-ink-500 font-body mb-4">
            <span className="flex items-center gap-2">
              <Mail size={14} />
              {user?.email}
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              Tham gia: {joinDate}
            </span>
            <span className="flex items-center gap-2">
              <BookOpen size={14} />
              {myPosts.length} bài viết
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/create-post"
              className="btn-primary flex items-center gap-1.5 text-sm"
            >
              <PenSquare size={14} />
              Viết bài mới
            </Link>
            <Link
              to="/edit-profile"
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <Settings size={14} />
              Chỉnh sửa hồ sơ
            </Link>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* MY POSTS */}
      <section>
        <h2 className="font-display text-xl font-semibold text-ink-900 mb-4">
          Bài viết của tôi
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : myPosts.length === 0 ? (
          <div className="card p-10 text-center">
            <PenSquare size={40} className="text-ink-300 mx-auto mb-3" />
            <p className="font-body text-ink-500 mb-4">
              Bạn chưa có bài viết nào.
            </p>
            <Link to="/create-post" className="btn-primary inline-flex">
              Viết bài đầu tiên
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {myPosts.map((post) => (
              <li
                key={post._id}
                className="card p-4 flex items-start gap-4 group"
              >
                {/* Post info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {post.category && (
                      <span className="badge text-xs">{post.category}</span>
                    )}
                    <time className="text-xs text-ink-400">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </time>
                  </div>
                  <Link
                    to={`/posts/${post._id}`}
                    className="font-display text-base font-semibold text-ink-800
                               hover:text-amber-600 transition-colors line-clamp-1"
                  >
                    {post.title}
                  </Link>
                  <p className="text-xs text-ink-400 font-body mt-0.5">
                    {post.likesCount ?? 0} lượt thích ·{" "}
                    {post.commentsCount ?? 0} bình luận
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    to={`/edit-post/${post._id}`}
                    className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-800
                               border border-ink-200 hover:border-ink-400 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <Edit2 size={12} /> Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700
                               border border-red-200 hover:border-red-400 px-2.5 py-1.5 rounded-md transition-colors"
                  >
                    <Trash2 size={12} /> Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
