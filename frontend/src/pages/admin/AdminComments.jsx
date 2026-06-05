import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import Avatar from "../../components/common/Avatar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { getAvatarUrl, truncate } from "../../utils/helpers";

export default function AdminComments() {
 const [comments, setComments] = useState([]);
 const [pagination, setPagination] = useState({});
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(true);

 const fetch = async () => {
 setLoading(true);
 try {
 const data = await adminService.getComments(page, search);
 setComments(data.comments);
 setPagination(data.pagination);
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi tải bình luận");
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

 const remove = async (c) => {
 if (!window.confirm("Xóa bình luận này?")) return;
 try {
 await adminService.deleteComment(c._id);
 toast.success("Đã xóa bình luận");
 fetch();
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi xóa bình luận");
 }
 };

 return (
 <div className="bg-white dark:bg-ink-900 rounded-xl border border-ink-200 dark:border-ink-800">
 <div className="p-4 border-b border-ink-100 dark:border-ink-800">
 <form onSubmit={handleSearch} className="relative">
 <Search
 size={16}
 className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
 />
 <input
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Tìm trong nội dung bình luận…"
 className="w-full pl-10 pr-4 py-2 border border-ink-200 dark:border-ink-700
 dark:bg-ink-800 dark:text-ink-100 rounded-lg text-sm
 focus:outline-none focus:border-amber-500"
 />
 </form>
 </div>

 {loading ? (
 <LoadingSpinner />
 ) : comments.length === 0 ? (
 <div className="p-8 text-center text-ink-400">Không có bình luận nào</div>
 ) : (
 <ul className="divide-y divide-ink-100 dark:divide-ink-800">
 {comments.map((c) => (
 <li key={c._id} className="p-4 hover:bg-ink-50/50 dark:hover:bg-ink-800/50">
 <div className="flex items-start gap-3">
 <Avatar src={getAvatarUrl(c.author?.avatar)} size={32} />
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2 text-sm">
 <span className="font-medium text-ink-800 dark:text-ink-100">
 {c.author?.username || "ẩn danh"}
 </span>
 <span className="text-xs text-ink-400">
 {new Date(c.createdAt).toLocaleString("vi-VN")}
 </span>
 </div>
 <p className="text-sm text-ink-700 dark:text-ink-300 mt-1">
 {truncate(c.content, 200)}
 </p>
 {c.post && (
 <Link
 to={`/posts/${c.post._id}`}
 className="text-xs text-amber-600 hover:underline mt-1 inline-flex items-center gap-1"
 >
 <MessageCircle size={12} />
 trong bài: {truncate(c.post.title, 50)}
 </Link>
 )}
 </div>
 <button
 onClick={() => remove(c)}
 className="p-2 text-ink-400 hover:text-red-600"
 title="Xóa"
 >
 <Trash2 size={16} />
 </button>
 </div>
 </li>
 ))}
 </ul>
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
