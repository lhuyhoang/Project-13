/**
 * pages/CreatePostPage.jsx
 * ──────────────────────────────────────────────────────────────
 * Trang "Viết bài mới" — mở modal PostComposer ngay khi vào trang.
 * Sau khi đăng bài xong → navigate về trang chi tiết bài viết.
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PenSquare } from "lucide-react";
import PostComposer from "../components/posts/PostComposer";

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Mở composer ngay khi vào trang
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Nếu user đóng modal mà chưa đăng → quay về trang chủ
    setTimeout(() => navigate("/"), 200);
  };

  const handleCreated = (post) => {
    if (post?._id) {
      navigate(`/posts/${post._id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* Fallback UI khi modal chưa mở */}
      {!isOpen && (
        <div className="card p-8 text-center">
          <PenSquare size={40} className="text-amber-500 mx-auto mb-3" />
          <h1 className="font-display text-2xl font-bold text-ink-900 mb-2">
            Viết bài mới
          </h1>
          <p className="text-ink-500 font-body text-sm mb-4">
            Đang mở trình soạn thảo...
          </p>
          <button onClick={() => setIsOpen(true)} className="btn-primary">
            Mở trình soạn thảo
          </button>
        </div>
      )}

      <PostComposer
        isOpen={isOpen}
        onClose={handleClose}
        onCreated={handleCreated}
      />
    </div>
  );
}
