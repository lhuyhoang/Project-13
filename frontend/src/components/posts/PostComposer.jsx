/**
 * components/posts/PostComposer.jsx
 * ──────────────────────────────────────────────────────────────
 * Modal composer tạo bài viết theo phong cách Facebook.
 *
 * Cấu trúc (từ trên xuống):
 *  1. Header: Tiêu đề "Tạo bài viết" + nút X đóng
 *  2. Author strip: Avatar + tên user
 *  3. Form nhập liệu:
 *     - Ô Tiêu đề (input riêng)
 *     - Ô Nội dung (textarea lớn, autosize)
 *  4. Cover image preview (nếu có) + nút xóa
 *  5. Hàng tuỳ chọn: Category + Tags + nút "Thêm ảnh bìa"
 *  6. Footer: Nút Đăng
 */
import { useState, useRef, useEffect } from "react";
import { X, ImagePlus, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/useAuthStore";
import Avatar from "../common/Avatar";
import postService from "../../services/postService";
import { getErrorMessage } from "../../utils/helpers";

const CATEGORIES = [
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

const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5MB
const COVER_ACCEPT = ["image/jpeg", "image/png", "image/webp"];

const TITLE_MIN = 5;
const CONTENT_MIN = 20;

export default function PostComposer({ isOpen, onClose, onCreated }) {
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const coverInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Reset form khi đóng
  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setContent("");
      setCategory("");
      setTags("");
      setCoverFile(null);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
    }
  }, [content]);

  // Đóng bằng phím Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCoverSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!COVER_ACCEPT.includes(file.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP");
      return;
    }
    if (file.size > MAX_COVER_SIZE) {
      toast.error("Ảnh quá lớn (tối đa 5MB)");
      return;
    }
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleRemoveCover = () => {
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverFile(null);
    setCoverPreview(null);
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const canSubmit =
    title.trim().length >= TITLE_MIN &&
    content.trim().length >= CONTENT_MIN &&
    category &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) {
      if (title.trim().length < TITLE_MIN)
        toast.error(`Tiêu đề phải có ít nhất ${TITLE_MIN} ký tự`);
      else if (content.trim().length < CONTENT_MIN)
        toast.error(`Nội dung phải có ít nhất ${CONTENT_MIN} ký tự`);
      else if (!category) toast.error("Vui lòng chọn danh mục");
      return;
    }
    setSubmitting(true);
    try {
      // Bước 1: Tạo bài viết
      const payload = {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim().replace(/^#/, ""))
              .filter(Boolean)
          : [],
      };
      const res = await postService.create(payload);
      const newPost = res.post || res;

      // Bước 2: Upload ảnh bìa nếu có
      if (coverFile && newPost?._id) {
        try {
          await postService.uploadCover(newPost._id, coverFile);
        } catch (e) {
          toast.error("Đăng bài thành công nhưng upload ảnh bìa thất bại");
        }
      }

      toast.success("Đã đăng bài viết!");
      onCreated?.(newPost);
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err, "Đăng bài thất bại"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── HEADER ───────────────────────────────────────────── */}
        <div className="flex items-center justify-center px-6 py-4 border-b border-ink-100 relative">
          <h2 className="font-display text-xl font-bold text-ink-900">
            Tạo bài viết
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 p-2 rounded-full hover:bg-ink-100 text-ink-500 hover:text-ink-800 transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── AUTHOR STRIP ─────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-6 pt-4 pb-2">
          <Avatar src={user?.avatar} name={user?.username} size="md" />
          <p className="font-semibold text-ink-900 text-sm">{user?.username}</p>
        </div>

        {/* ── FORM (scrollable) ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 pb-2 space-y-4">
          {/* Cover preview */}
          {coverPreview && (
            <div className="relative rounded-xl overflow-hidden bg-ink-100">
              <img
                src={coverPreview}
                alt="Cover preview"
                className="w-full max-h-64 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 p-1.5 bg-ink-950/70 hover:bg-ink-950 text-white rounded-full transition-colors"
                aria-label="Xóa ảnh bìa"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Ô TIÊU ĐỀ */}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-body">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              maxLength={150}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-md bg-white text-ink-900
 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-400
 focus:border-transparent transition-all font-display text-lg"
            />
            <p className="mt-1 text-xs text-ink-400 font-body text-right">
              {title.length}/150
            </p>
          </div>

          {/* Ô NỘI DUNG */}
          <div>
            <label className="block text-xs font-medium text-ink-500 mb-1 font-body">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`${user?.username || "Bạn"} ơi, bạn đang nghĩ gì thế?`}
              rows={6}
              className="w-full px-3 py-2.5 border border-ink-200 rounded-md bg-white text-ink-900
 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ink-400
 focus:border-transparent transition-all font-body text-base leading-relaxed resize-none"
              style={{ minHeight: "140px" }}
            />
            <p className="mt-1 text-xs text-ink-400 font-body text-right">
              {content.length} ký tự (tối thiểu {CONTENT_MIN})
            </p>
          </div>
        </div>

        {/* ── HÀNG TUỲ CHỌN (Category + Tags + Ảnh bìa) ─────────── */}
        <div className="px-6 py-3 border-t border-ink-100 flex flex-wrap items-center gap-2">
          {/* Nút thêm ảnh bìa */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100
 text-green-700 text-sm font-body transition-colors"
          >
            <ImagePlus size={16} />
            Ảnh bìa
          </button>
          <input
            ref={coverInputRef}
            type="file"
            accept={COVER_ACCEPT.join(",")}
            onChange={handleCoverSelect}
            className="hidden"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-body focus:outline-none cursor-pointer transition-colors ${
              category
                ? "bg-amber-100 text-amber-800"
                : "bg-ink-100 hover:bg-ink-200 text-ink-700"
            }`}
          >
            <option value="">+ Danh mục</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Tags */}
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="+ Tags (cách nhau dấu phẩy)"
            className="flex-1 min-w-[140px] px-3 py-1.5 rounded-full bg-ink-100 hover:bg-ink-200
 focus:bg-white focus:ring-2 focus:ring-ink-300 text-sm font-body
 text-ink-700 placeholder:text-ink-400 outline-none"
          />
        </div>

        {/* ── FOOTER (Submit) ──────────────────────────────────── */}
        <div className="px-6 py-3 border-t border-ink-100">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full py-2.5 rounded-lg bg-ink-900 hover:bg-ink-700
 disabled:bg-ink-300 disabled:cursor-not-allowed
 text-white font-semibold font-body transition-colors
 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Đang đăng...
              </>
            ) : (
              <>
                <Send size={16} /> Đăng
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
