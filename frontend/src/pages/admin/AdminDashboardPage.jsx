import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, FileText, MessageCircle, Shield } from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import AdminStats from "./AdminStats";
import AdminUsers from "./AdminUsers";
import AdminPosts from "./AdminPosts";
import AdminComments from "./AdminComments";

const TABS = [
 { key: "stats", label: "Thống kê", icon: LayoutDashboard, component: AdminStats },
 { key: "users", label: "Người dùng", icon: Users, component: AdminUsers },
 { key: "posts", label: "Bài viết", icon: FileText, component: AdminPosts },
 { key: "comments", label: "Bình luận", icon: MessageCircle, component: AdminComments },
];

export default function AdminDashboardPage() {
 const { isAuthenticated, user } = useAuthStore();
 const location = useLocation();
 const [activeTab, setActiveTab] = useState("stats");

 if (!isAuthenticated()) {
 return <Navigate to="/login" state={{ from: location.pathname }} replace />;
 }
 if (user?.role !== "admin") {
 return (
 <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
 <div className="text-6xl mb-4">⛔</div>
 <h1 className="text-2xl font-display font-bold text-ink-800 mb-2">
 Không có quyền truy cập
 </h1>
 <p className="text-ink-500">Bạn cần tài khoản admin.</p>
 </div>
 );
 }

 const Active = TABS.find((t) => t.key === activeTab).component;

 return (
 <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
 {/* Header */}
 <header className="bg-white dark:bg-ink-900 border-b border-ink-200 dark:border-ink-800">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-3">
 <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
 <Shield size={20} />
 </div>
 <div>
 <h1 className="text-xl font-display font-bold text-ink-900 dark:text-ink-50">
 Admin Dashboard
 </h1>
 <p className="text-xs text-ink-500 dark:text-ink-400">
 Quản lý toàn bộ BlogViet
 </p>
 </div>
 </div>
 </header>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6">
 {/* Sidebar Tabs */}
 <aside className="lg:w-56 flex-shrink-0">
 <nav className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800 p-2 flex lg:flex-col gap-1 overflow-x-auto">
 {TABS.map((t) => {
 const Icon = t.icon;
 const isActive = activeTab === t.key;
 return (
 <button
 key={t.key}
 onClick={() => setActiveTab(t.key)}
 className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm
 transition whitespace-nowrap ${
 isActive
 ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-medium"
 : "text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800"
 }`}
 >
 <Icon size={16} />
 {t.label}
 </button>
 );
 })}
 </nav>
 </aside>

 {/* Content */}
 <main className="flex-1 min-w-0">
 <Active />
 </main>
 </div>
 </div>
 );
}
