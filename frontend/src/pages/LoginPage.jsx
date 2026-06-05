import { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, LogIn, BookOpen } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../stores/useAuthStore";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

// VALIDATION SCHEMA
const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPwd, setShowPwd] = useState(false);

  const { login, isLoading, error, clearError, user } = useAuthStore();

  // Nếu đã đăng nhập rồi → redirect
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  // Xóa lỗi khi unmount
  useEffect(() => () => clearError(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Đăng nhập thành công! 🎉");
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch {
      // Lỗi đã được lưu vào store, hiện ở UI bên dưới
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 page-enter
                    bg-gradient-to-br from-ink-50 via-white to-amber-50"
    >
      <div className="w-full max-w-md">
        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <BookOpen size={28} className="text-amber-500" />
            <span className="font-display text-2xl font-bold text-ink-900">
              Blog<span className="text-amber-500">Viet</span>
            </span>
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink-900">
            Chào mừng trở lại
          </h2>
          <p className="text-ink-500 font-body text-sm mt-1">
            Đăng nhập để tiếp tục chia sẻ
          </p>
        </div>

        {/* FORM CARD */}
        <div className="card p-8">
          {/* Server error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Email
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
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu..."
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" /> Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn size={16} /> Đăng nhập
                </>
              )}
            </button>
          </form>

          {/* Link đăng ký */}
          <p className="mt-6 text-center text-sm text-ink-500 font-body">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-amber-600 font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
