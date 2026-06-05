import { useState, useEffect } from "react";
import { Search, Trash2, Shield, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import Avatar from "../../components/common/Avatar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { getAvatarUrl } from "../../utils/helpers";

export default function AdminUsers() {
 const [users, setUsers] = useState([]);
 const [pagination, setPagination] = useState({});
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(true);

 const fetch = async () => {
 setLoading(true);
 try {
 const data = await adminService.getUsers(page, search);
 setUsers(data.users);
 setPagination(data.pagination);
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi tải users");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 fetch();
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [page]);

 const handleSearch = (e) => {
 e.preventDefault();
 setPage(1);
 fetch();
 };

 const toggleRole = async (u) => {
 const newRole = u.role === "admin" ? "user" : "admin";
 if (
 !window.confirm(
 `Đổi quyền ${u.username} từ "${u.role}" → "${newRole}"?`,
 )
 )
 return;
 try {
 await adminService.updateUserRole(u._id, newRole);
 toast.success("Đã cập nhật quyền");
 fetch();
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi cập nhật quyền");
 }
 };

 const remove = async (u) => {
 if (
 !window.confirm(
 `Xóa "${u.username}"? Toàn bộ bài viết & bình luận của họ cũng sẽ bị xóa.`,
 )
 )
 return;
 try {
 await adminService.deleteUser(u._id);
 toast.success("Đã xóa người dùng");
 fetch();
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi xóa user");
 }
 };

 return (
 <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800">
 <div className="p-4 border-b border-ink-100 dark:border-ink-800 flex items-center gap-3">
 <form onSubmit={handleSearch} className="flex-1 relative">
 <Search
 size={16}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
 />
 <input
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Tìm theo username hoặc email…"
 className="w-full pl-10 pr-4 py-2 border border-ink-200 dark:border-ink-700
 dark:bg-ink-800 dark:text-ink-100 rounded-lg text-sm
 focus:outline-none focus:border-amber-500"
 />
 </form>
 </div>

 {loading ? (
 <LoadingSpinner />
 ) : users.length === 0 ? (
 <div className="p-8 text-center text-ink-400">Không có người dùng nào</div>
 ) : (
 <div className="overflow-x-auto">
 <table className="w-full text-sm">
 <thead className="bg-ink-50 dark:bg-ink-800 text-ink-600 dark:text-ink-300 text-left">
 <tr>
 <th className="px-4 py-3 font-medium">Người dùng</th>
 <th className="px-4 py-3 font-medium">Email</th>
 <th className="px-4 py-3 font-medium">Quyền</th>
 <th className="px-4 py-3 font-medium">Ngày tạo</th>
 <th className="px-4 py-3 font-medium text-right">Hành động</th>
 </tr>
 </thead>
 <tbody>
 {users.map((u) => (
 <tr
 key={u._id}
 className="border-t border-ink-100 dark:border-ink-800
 hover:bg-ink-50/50 dark:hover:bg-ink-800/50"
 >
 <td className="px-4 py-3 flex items-center gap-2">
 <Avatar
 src={getAvatarUrl(u.avatar)}
 alt={u.username}
 size={32}
 />
 <span className="font-medium text-ink-800 dark:text-ink-100">{u.username}</span>
 </td>
 <td className="px-4 py-3 text-ink-600 dark:text-ink-300">{u.email}</td>
 <td className="px-4 py-3">
 <span
 className={`px-2 py-0.5 rounded-full text-xs font-medium ${
 u.role === "admin"
 ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
 : "bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300"
 }`}
 >
 {u.role}
 </span>
 </td>
 <td className="px-4 py-3 text-ink-500 dark:text-ink-400">
 {new Date(u.createdAt).toLocaleDateString("vi-VN")}
 </td>
 <td className="px-4 py-3 text-right">
 <button
 onClick={() => toggleRole(u)}
 className="inline-flex items-center gap-1 px-2 py-1
 text-xs text-ink-600 hover:text-amber-600"
 title="Đổi quyền"
 >
 {u.role === "admin" ? <UserIcon size={14} /> : <Shield size={14} />}
 </button>
 <button
 onClick={() => remove(u)}
 className="inline-flex items-center gap-1 px-2 py-1
 text-xs text-red-600 hover:text-red-800"
 title="Xóa"
 >
 <Trash2 size={14} />
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 )}

 {pagination.totalPages > 1 && (
 <div className="p-4 border-t border-ink-100">
 <Pagination
 currentPage={page}
 totalPages={pagination.totalPages}
 onPageChange={setPage}
 />
 </div>
 )}
 </div>
 );
}
