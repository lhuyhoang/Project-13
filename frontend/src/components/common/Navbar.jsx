import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
 PenSquare,
 LogOut,
 User,
 Menu,
 X,
 BookOpen,
 Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../stores/useAuthStore";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lấy user và hàm logout từ Zustand store
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất");
    navigate("/");
    setMobileOpen(false);
  };

  // Helper: kiểm tra active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ink-950 text-ink-100 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <BookOpen
              size={22}
              className="text-amber-400 group-hover:rotate-12 transition-transform duration-200"
            />
            <span className="font-display text-xl font-semibold tracking-tight text-white">
              Blog<span className="text-amber-400">Viet</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <Link
              to="/"
              className={`text-sm font-body transition-colors hover:text-white ${
                isActive("/") ? "text-amber-400" : "text-ink-300"
              }`}
            >
              Trang chủ
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/create-post"
                  className="flex items-center gap-1.5 text-sm font-body text-ink-300 hover:text-white transition-colors"
                >
                  <PenSquare size={15} />
                  Viết bài
                </Link>
                {user?.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 text-sm font-body transition-colors hover:text-white ${
                      location.pathname.startsWith("/admin")
                        ? "text-amber-400"
                        : "text-ink-300"
                    }`}
                  >
                    <Shield size={15} />
                    Admin
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 text-sm font-body transition-colors hover:text-white ${
                    isActive("/profile") ? "text-amber-400" : "text-ink-300"
                  }`}
                >
                  {/* Avatar */}
                  <Avatar src={user?.avatar} name={user?.username} size="sm" />
                  <span className="hidden lg:inline">{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm font-body text-ink-400 hover:text-red-400 transition-colors"
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-body text-ink-300 hover:text-white transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-body bg-amber-500 hover:bg-amber-400 text-ink-950 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            className="md:hidden p-2 rounded-md text-ink-300 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-ink-900 border-t border-ink-800 px-4 py-4 space-y-3 animate-fade-in">
          <div className="flex justify-end pb-2 border-b border-ink-800">
            <ThemeToggle />
          </div>
          <MobileNavLink
            to="/"
            label="Trang chủ"
            onClick={() => setMobileOpen(false)}
          />
          {isAuthenticated ? (
            <>
              <MobileNavLink
                to="/create-post"
                label="✏️ Viết bài mới"
                onClick={() => setMobileOpen(false)}
              />
              {user?.role === "admin" && (
                <MobileNavLink
                  to="/admin"
                  label="🛡️ Admin Panel"
                  onClick={() => setMobileOpen(false)}
                />
              )}
              <MobileNavLink
                to="/profile"
                label={`👤 ${user?.username}`}
                onClick={() => setMobileOpen(false)}
              />
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm text-red-400 py-2 border-t border-ink-700 mt-2 pt-3"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <MobileNavLink
                to="/login"
                label="Đăng nhập"
                onClick={() => setMobileOpen(false)}
              />
              <MobileNavLink
                to="/register"
                label="Đăng ký"
                onClick={() => setMobileOpen(false)}
              />
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// Helper component cho mobile menu links
function MobileNavLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-sm font-body text-ink-200 hover:text-white py-2"
    >
      {label}
    </Link>
  );
}
