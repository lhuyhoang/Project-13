import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Lock,
  Save,
  ArrowLeft,
  User,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";
import authService from "../services/authService";
import AvatarUploader from "../components/common/AvatarUploader";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { getErrorMessage } from "../utils/helpers";

// VALIDATION SCHEMAS
const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username phải có ít nhất 3 ký tự")
    .max(30, "Username không quá 30 ký tự"),
  bio: z
    .string()
    .max(200, "Tiểu sử không quá 200 ký tự")
    .optional()
    .or(z.literal("")),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Vui lòng nhập mật khẩu hiện tại"),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu mới"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })
  .refine((d) => d.newPassword !== d.currentPassword, {
    message: "Mật khẩu mới phải khác mật khẩu hiện tại",
    path: ["newPassword"],
  });

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [showPwd, setShowPwd] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  //PROFILE FORM
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isDirty: profileDirty },
    reset: resetProfile,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const onProfileSubmit = async (data) => {
    setProfileLoading(true);
    try {
      const { user: updated } = await authService.updateProfile(data);
      updateUser(updated); // đồng bộ store → Navbar, ProfilePage... tự re-render
      resetProfile({ username: updated.username, bio: updated.bio });
      toast.success("Cập nhật thông tin thành công");
    } catch (err) {
      toast.error(getErrorMessage(err, "Cập nhật thất bại"));
    } finally {
      setProfileLoading(false);
    }
  };

  //PASSWORD FORM
  const {
    register: registerPwd,
    handleSubmit: handlePwdSubmit,
    reset: resetPwd,
    formState: { errors: pwdErrors },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onPwdSubmit = async (data) => {
    setPwdLoading(true);
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Đổi mật khẩu thành công");
      resetPwd();
    } catch (err) {
      toast.error(getErrorMessage(err, "Đổi mật khẩu thất bại"));
    } finally {
      setPwdLoading(false);
    }
  };

  //AVATAR UPLOAD
  const handleAvatarSuccess = (updatedUser) => {
    updateUser(updatedUser);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 page-enter">
      {/* HEADER */}
      <div className="mb-8">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-3 font-body"
        >
          <ArrowLeft size={14} /> Quay lại trang cá nhân
        </Link>
        <h1 className="font-display text-3xl font-bold text-ink-900">
          Chỉnh sửa thông tin cá nhân
        </h1>
      </div>

      {/* AVATAR SECTION */}
      <section className="card p-6 md:p-8 mb-6">
        <h2 className="font-display text-lg font-semibold text-ink-800 mb-6 flex items-center gap-2">
          <User size={18} />
          Ảnh đại diện
        </h2>
        <AvatarUploader
          currentSrc={user?.avatar}
          currentName={user?.username}
          onSuccess={handleAvatarSuccess}
          size="xl"
        />
      </section>

      {/* PROFILE INFO SECTION */}
      <section className="card p-6 md:p-8 mb-6">
        <h2 className="font-display text-lg font-semibold text-ink-800 mb-6 flex items-center gap-2">
          <FileText size={18} />
          Thông tin cơ bản
        </h2>

        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="space-y-5"
        >
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Username
            </label>
            <input
              {...registerProfile("username")}
              className={`input-field ${profileErrors.username ? "input-error" : ""}`}
            />
            {profileErrors.username && (
              <p className="mt-1 text-xs text-red-500">
                {profileErrors.username.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Tiểu sử
            </label>
            <textarea
              {...registerProfile("bio")}
              rows={3}
              placeholder="Giới thiệu ngắn về bạn..."
              className={`input-field resize-none ${profileErrors.bio ? "input-error" : ""}`}
            />
            {profileErrors.bio ? (
              <p className="mt-1 text-xs text-red-500">
                {profileErrors.bio.message}
              </p>
            ) : (
              <p className="mt-1 text-xs text-ink-400 font-body">
                Tối đa 200 ký tự
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={profileLoading || !profileDirty}
            className="btn-primary flex items-center gap-1.5"
          >
            {profileLoading ? (
              <>
                <LoadingSpinner size="sm" /> Đang lưu...
              </>
            ) : (
              <>
                <Save size={14} /> Lưu thay đổi
              </>
            )}
          </button>
        </form>
      </section>

      {/* PASSWORD SECTION */}
      <section className="card p-6 md:p-8">
        <h2 className="font-display text-lg font-semibold text-ink-800 mb-6 flex items-center gap-2">
          <Lock size={18} />
          Đổi mật khẩu
        </h2>

        <form onSubmit={handlePwdSubmit(onPwdSubmit)} className="space-y-5">
          {/* Current password */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                {...registerPwd("currentPassword")}
                type={showPwd.current ? "text" : "password"}
                className={`input-field pr-10 ${pwdErrors.currentPassword ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPwd((s) => ({ ...s, current: !s.current }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPwd.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwdErrors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">
                {pwdErrors.currentPassword.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                {...registerPwd("newPassword")}
                type={showPwd.new ? "text" : "password"}
                className={`input-field pr-10 ${pwdErrors.newPassword ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => ({ ...s, new: !s.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPwd.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwdErrors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {pwdErrors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                {...registerPwd("confirmPassword")}
                type={showPwd.confirm ? "text" : "password"}
                className={`input-field pr-10 ${pwdErrors.confirmPassword ? "input-error" : ""}`}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPwd((s) => ({ ...s, confirm: !s.confirm }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showPwd.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {pwdErrors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {pwdErrors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={pwdLoading}
            className="btn-primary flex items-center gap-1.5"
          >
            {pwdLoading ? (
              <>
                <LoadingSpinner size="sm" /> Đang đổi...
              </>
            ) : (
              <>
                <Lock size={14} /> Đổi mật khẩu
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}
