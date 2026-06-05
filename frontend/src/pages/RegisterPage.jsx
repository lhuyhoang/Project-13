import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, Eye, EyeOff, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

// VALIDATION SCHEMA
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(30, "Tên đăng nhập không được vượt quá 30 ký tự")
      .regex(/^[a-zA-Z0-9_]+$/, "Chỉ dùng chữ, số và dấu _"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);

  const {
    register: registerUser,
    isLoading,
    error,
    clearError,
    user,
  } = useAuthStore();

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  useEffect(() => () => clearError(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...payload } = data;
    try {
      await registerUser(payload);
      toast.success("Đăng ký thành công! Chào mừng bạn 🎉");
      navigate("/");
    } catch {
      // Lỗi hiện từ store
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 page-enter
                    bg-gradient-to-br from-ink-50 via-white to-amber-50"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen size={28} className="text-amber-500" />
            <span className="font-display text-2xl font-bold text-ink-900">
              Blog<span className="text-amber-500">Viet</span>
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink-900">
            Tạo tài khoản mới
          </h2>
          <p className="text-ink-500 font-body text-sm mt-1">
            Tham gia cộng đồng viết blog hôm nay
          </p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                {...register("username")}
                type="text"
                autoComplete="username"
                placeholder="nguyenvana"
                className={`input-field ${errors.username ? "input-error" : ""}`}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                className={`input-field ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Tối thiểu 6 ký tự"
                  className={`input-field pr-10 ${errors.password ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                {...register("confirmPassword")}
                type={showPwd ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Nhập lại mật khẩu"
                className={`input-field ${errors.confirmPassword ? "input-error" : ""}`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" /> Đang tạo tài khoản...
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Đăng ký
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 font-body">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              className="text-amber-600 font-medium hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
