import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

export default function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  // Kiểm tra cả token và user để đảm bảo chắc chắn
  if (!token || !user) {
    // Lưu lại trang đang cố vào để redirect lại sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render child route nếu đã đăng nhập
  return <Outlet />;
}
