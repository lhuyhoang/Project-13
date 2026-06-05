import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

export default function AdminRoute({ children }) {
 const { user, isAuthenticated } = useAuthStore();
 const location = useLocation();

 if (!isAuthenticated()) {
 return (
 <Navigate
 to="/login"
 state={{ from: location.pathname }}
 replace
 />
 );
 }

 if (user?.role !== "admin") {
 return (
 <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
 <div className="text-6xl mb-4">⛔</div>
 <h1 className="text-2xl font-display font-bold text-ink-800 mb-2">
 Không có quyền truy cập
 </h1>
 <p className="text-ink-500 text-center max-w-md">
 Bạn cần tài khoản admin để vào trang này. Nếu bạn là admin,
 hãy đăng nhập bằng tài khoản admin.
 </p>
 </div>
 );
 }

 return children;
}
