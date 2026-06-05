import { useState, useRef } from "react";
import { Camera, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import authService from "../../services/authService";
import Avatar from "./Avatar";
import { getErrorMessage } from "../../utils/helpers";

const MAX_SIZE = 2 * 1024 * 1024; // 2MB — khớp với backend
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function AvatarUploader({
  currentSrc,
  currentName = "",
  onSuccess,
  size = "xl",
}) {
  const [preview, setPreview] = useState(null); // URL.createObjectURL khi chọn file
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate phía client trước khi upload
    if (!ACCEPT.includes(selected.type)) {
      toast.error("Chỉ chấp nhận ảnh JPG, PNG, WEBP, GIF");
      return;
    }
    if (selected.size > MAX_SIZE) {
      toast.error("Ảnh quá lớn (tối đa 2MB)");
      return;
    }

    // Giải phóng URL cũ nếu có để tránh memory leak
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleCancel = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const { user } = await authService.updateAvatar(file);
      toast.success("Cập nhật avatar thành công");
      handleCancel();
      onSuccess?.(user);
    } catch (err) {
      toast.error(getErrorMessage(err, "Upload thất bại"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* AVATAR + CAMERA BUTTON */}
      <div className="relative group">
        <Avatar
          src={preview || currentSrc}
          name={currentName}
          size={size}
          className={uploading ? "opacity-50" : ""}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-ink-950/0 group-hover:bg-ink-950/40
 flex items-center justify-center transition-colors"
          aria-label="Đổi avatar"
        >
          <Camera
            size={24}
            className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(",")}
          onChange={handleSelect}
          className="hidden"
        />
      </div>

      {/* ACTION BUTTONS (chỉ hiện khi đã chọn file) */}
      {preview && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={uploading}
            className="btn-secondary text-sm flex items-center gap-1.5"
          >
            <X size={14} /> Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={uploading}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Check size={14} />
            {uploading ? "Đang lưu..." : "Lưu ảnh mới"}
          </button>
        </div>
      )}

      <p className="text-xs text-ink-400 font-body">
        JPG, PNG, WEBP, GIF. Tối đa 2MB.
      </p>
    </div>
  );
}
