import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "../common/LoadingSpinner";
import RichTextEditor from "../common/RichTextEditor";

// ── ZOD SCHEMA ───────────────────────────────────────────────
const postSchema = z.object({
  title: z
    .string()
    .min(10, "Tiêu đề phải có ít nhất 10 ký tự")
    .max(150, "Tiêu đề không được vượt quá 150 ký tự"),
  content: z.string().min(50, "Nội dung phải có ít nhất 50 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  tags: z.string().optional(), // Chuỗi tags cách nhau bởi dấu phẩy
});

// Danh sách category
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

export default function PostForm({
 defaultValues = {},
 onSubmit,
 isLoading = false,
 submitLabel = "Đăng bài",
}) {
 const {
 register,
 handleSubmit,
 formState: { errors },
 setValue,
 watch,
 } = useForm({
 resolver: zodResolver(postSchema),
 defaultValues: {
 title: defaultValues.title || "",
 content: defaultValues.content || "",
 category: defaultValues.category || "",
 tags: Array.isArray(defaultValues.tags)
 ? defaultValues.tags.join(", ")
 : defaultValues.tags || "",
 },
 });

 const [content, setContent] = useState(defaultValues.content || "");

 useEffect(() => {
 setValue("content", content, { shouldValidate: true, shouldDirty: true });
 }, [content, setValue]);

 // Đếm ký tự content (đã strip HTML) để hiển thị cho user
 const handleFormSubmit = (data) => {
 const payload = {
 ...data,
 tags: data.tags
 ? data.tags
 .split(",")
 .map((t) => t.trim())
 .filter(Boolean)
 : [],
 };
 onSubmit(payload);
 };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          type="text"
          placeholder="Nhập tiêu đề bài viết..."
          className={`input-field font-display text-lg ${errors.title ? "input-error" : ""}`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* CATEGORY */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Danh mục <span className="text-red-500">*</span>
        </label>
        <select
          {...register("category")}
          className={`input-field ${errors.category ? "input-error" : ""}`}
        >
          <option value="">-- Chọn danh mục --</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
        )}
      </div>

 {/* CONTENT */}
 <div>
 <label className="block text-sm font-medium text-ink-700 mb-1.5">
 Nội dung <span className="text-red-500">*</span>
 </label>
 <RichTextEditor
 value={content}
 onChange={setContent}
 placeholder="Viết nội dung bài viết của bạn..."
 />
 <input type="hidden" {...register("content")} />
 <div className="flex justify-between mt-1">
 {errors.content ? (
 <p className="text-xs text-red-500">{errors.content.message}</p>
 ) : (
 <span />
 )}
 <p className="text-xs text-ink-400">
 {content.replace(/<[^>]+>/g, "").length} ký tự
 </p>
 </div>
 </div>

      {/* TAGS (optional) */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Tags{" "}
          <span className="text-ink-400 font-normal text-xs">
            (tùy chọn, cách nhau bởi dấu phẩy)
          </span>
        </label>
        <input
          {...register("tags")}
          type="text"
          placeholder="ví dụ: react, nodejs, web"
          className="input-field"
        />
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading && <LoadingSpinner size="sm" />}
          {isLoading ? "Đang lưu..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
