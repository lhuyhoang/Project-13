import { useState, useEffect } from "react";
import { Users, FileText, MessageCircle, Heart, Shield } from "lucide-react";
import adminService from "../../services/adminService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";

const StatCard = ({ icon: Icon, label, value, color }) => (
 <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-6 hover:shadow-md transition">
 <div className="flex items-center justify-between mb-3">
 <div
 className="w-10 h-10 rounded-lg flex items-center justify-center"
 style={{ backgroundColor: `${color}20`, color }}
 >
 <Icon size={20} />
 </div>
 </div>
 <div className="text-3xl font-display font-bold text-ink-900 dark:text-ink-50">
 {value ?? "—"}
 </div>
 <div className="text-sm text-ink-500 dark:text-ink-400 mt-1">{label}</div>
 </div>
);

export default function AdminStats() {
 const [stats, setStats] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 useEffect(() => {
 (async () => {
 try {
 const data = await adminService.getStats();
 setStats(data.stats);
 } catch (e) {
 setError(e.response?.data?.message || "Không thể tải thống kê");
 } finally {
 setLoading(false);
 }
 })();
 }, []);

 if (loading) return <LoadingSpinner />;
 if (error)
 return <div className="text-red-600 text-sm">{error}</div>;

 return (
 <div className="space-y-6">
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
 <StatCard
 icon={Users}
 label="Tổng thành viên"
 value={stats.totalUsers}
 color="#635a44"
 />
 <StatCard
 icon={FileText}
 label="Tổng bài viết"
 value={stats.totalPosts}
 color="#d97706"
 />
 <StatCard
 icon={MessageCircle}
 label="Tổng bình luận"
 value={stats.totalComments}
 color="#059669"
 />
 <StatCard
 icon={Heart}
 label="Tổng lượt thích"
 value={stats.totalLikes}
 color="#dc2626"
 />
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
 <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-6">
 <h3 className="font-display font-bold text-ink-900 dark:text-ink-50 mb-4 flex items-center gap-2">
 <Shield size={18} className="text-amber-600" />
 Quản trị viên ({stats.adminCount})
 </h3>
 <p className="text-sm text-ink-500 dark:text-ink-400">
 Có <strong>{stats.adminCount}</strong> tài khoản admin trong hệ thống.
 </p>
 </div>

 <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-6">
 <h3 className="font-display font-bold text-ink-900 dark:text-ink-50 mb-4">
 Thành viên mới nhất
 </h3>
 <ul className="space-y-2">
 {stats.recentUsers.map((u) => (
 <li
 key={u._id}
 className="flex items-center justify-between text-sm"
 >
 <span className="text-ink-800 dark:text-ink-200">{u.username}</span>
 <span className="text-xs text-ink-400">
 {new Date(u.createdAt).toLocaleDateString("vi-VN")}
 </span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 );
}
