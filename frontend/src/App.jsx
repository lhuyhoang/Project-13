import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminRoute from "./components/common/AdminRoute";

import HomePage from "./pages/HomePage";
import PostDetailPage from "./pages/PostDetailPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

export default function App() {
  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 transition-colors">
      {/* Navbar cố định ở trên cùng */}
      <Navbar />

      {/* Main content – padding-top để không bị Navbar che */}
      <main className="pt-16">
        <Routes>
          {/* ── PUBLIC ROUTES ── */}
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

 {/* ── PROTECTED ROUTES ── */}
 {/*
 ProtectedRoute kiểm tra user đã đăng nhập chưa
 Nếu chưa → redirect về /login (kèm state để redirect lại sau khi login)
 */}
 <Route element={<ProtectedRoute />}>
 <Route path="/create-post" element={<CreatePostPage />} />
 <Route path="/edit-post/:id" element={<EditPostPage />} />
 <Route path="/profile" element={<ProfilePage />} />
 <Route path="/edit-profile" element={<EditProfilePage />} />
 </Route>

 {/* ── ADMIN ROUTES ── */}
 <Route
 path="/admin/*"
 element={
 <AdminRoute>
 <AdminDashboardPage />
 </AdminRoute>
 }
 />

          {/* ── FALLBACK ── */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
}
