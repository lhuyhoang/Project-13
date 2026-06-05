import { Link } from "react-router-dom";
import { Home, Frown } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 page-enter">
      <Frown size={64} className="text-ink-200 mb-6" strokeWidth={1} />
      <h1 className="font-display text-6xl font-bold text-ink-200 mb-4">404</h1>
      <h2 className="font-display text-2xl font-semibold text-ink-700 mb-2">
        Trang không tồn tại
      </h2>
      <p className="text-ink-400 font-body text-center mb-8 max-w-sm">
        Có vẻ như trang bạn đang tìm kiếm đã bị xóa hoặc không tồn tại.
      </p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <Home size={16} /> Về trang chủ
      </Link>
    </div>
  );
}
