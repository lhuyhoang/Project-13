import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Trash2, Eye, Heart, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import adminService from "../../services/adminService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { truncate } from "../../utils/helpers";

export default function AdminPosts() {
 const [posts, setPosts] = useState([]);
 const [pagination, setPagination] = useState({});
 const [page, setPage] = useState(1);
 const [search, setSearch] = useState("");
 const [loading, setLoading] = useState(true);

 const fetch = async () => {
 setLoading(true);
 try {
 const data = await adminService.getPosts(page, search);
 setPosts(data.posts);
 setPagination(data.pagination);
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi tải bài viết");
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

 const remove = async (p) => {
 if (!window.confirm(`Xóa bài "${p.title}"? Toàn bộ bình luận sẽ bị xóa.`))
 return;
 try {
 await adminService.deletePost(p._id);
 toast.success("Đã xóa bài viết");
 fetch();
 } catch (e) {
 toast.error(e.response?.data?.message || "Lỗi xóa bài viết");
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
 placeholder="Tìm theo tiêu đề…"
 className="w-full pl-10 pr-4 py-2 border border-ink-200 dark:border-ink-700
 dark:bg-ink-800 dark:text-ink-100 rounded-lg text-sm
 focus:outline-none focus:border-amber-500"
 />
 </form>
 </div>

 {loading ? (
 <LoadingSpinner />
 ) : posts.length === 0 ? (
 <div className="p-8 text-center text-ink-400">Không có bài viết nào</div>
 ) : (
 <ul className="divide-y divide-ink-100 dark:divide-ink-800">
 {posts.map((p) => (
 <li key={p._id} className="p-4 hover:bg-ink-50/50 dark:hover:bg-ink-800/50">
 <div className="flex items-start gap-3">
 {p.coverImage && (
 <img
 src={`${(import.meta.env.VITE_API_URL || "").replace(/\/api$/, "")}${p.coverImage}`}
 alt=""
 className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
 />
 )}
 <div className="flex-1 min-w-0">
 <Link
 to={`/posts/${p._id}`}
 className="font-display font-bold text-ink-900 dark:text-ink-50 hover:text-amber-600 line-clamp-1"
 >
 {p.title}
 </Link>
 <p className="text-sm text-ink-500 dark:text-ink-400 mt-1 line-clamp-2">
 {truncate(p.content, 120)}
 </p>
 <div className="flex items-center gap-3 mt-2 text-xs text-ink-400">
 <span>bởi {p.author?.username || "ẩn danh"}</span>
 <span>· {new Date(p.createdAt).toLocaleDateString("vi-VN")}</span>
 <span className="flex items-center gap-1">
 <Heart size={12} /> {p.likes?.length || 0}
 </span>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <Link
 to={`/posts/${p._id}`}
 className="p-2 text-ink-400 hover:text-amber-600"
 title="Xem"
 >
 <Eye size={16} />
 </Link>
 <button
 onClick={() => remove(p)}
 className="p-2 text-ink-400 hover:text-red-600"
 title="Xóa"
 >
 <Trash2 size={16} />
 </button>
 </div>
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
