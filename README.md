# BlogViet

> Nền tảng blog full-stack xây dựng bằng **MERN stack** (MongoDB + Express + React + Node.js) với xác thực JWT, rich text editor, dark mode, phân quyền admin, realtime qua Socket.io và giao diện responsive Tailwind CSS.

Dự án hỗ trợ đầy đủ tính năng: CRUD bài viết với TipTap rich text editor, bình luận, thả tim, phân trang, tìm kiếm, upload avatar & ảnh bìa, chỉnh sửa hồ sơ, dark/light mode, và **Admin Dashboard** quản lý toàn bộ hệ thống.

---

## Mục lục

- [Tính năng](#tính-năng)
- [Tech stack](#tech-stack)
- [Kiến trúc](#kiến-trúc)
- [Yêu cầu môi trường](#yêu-cầu-môi-trường)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Chạy dự án](#chạy-dự-án)
- [Tài khoản demo](#tài-khoản-demo)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Tài liệu liên quan](#tài-liệu-liên-quan)
- [Roadmap](#roadmap)

---

## Tính năng

### Người dùng

- 📝 **Đăng ký / Đăng nhập** với JWT (bcrypt hash)
- 👤 **Trang cá nhân** với avatar, bio, ngày tham gia
- ✏️ **Chỉnh sửa hồ sơ**: đổi username, bio, mật khẩu, **upload avatar**
- 🖼️ **Upload ảnh đại diện** (preview trước khi lưu, validate type/size)

### Bài viết

- 📰 **CRUD bài viết** (tạo, xem, sửa, xóa)
- ✍️ **Rich Text Editor** (TipTap) — định dạng văn bản: Bold, Italic, Headings, List, Quote, Code block, Link…
- 🖼️ **Upload ảnh bìa** cho bài viết
- ❤️ **Like / Unlike** bài viết
- 💬 **Bình luận** (xóa nếu là tác giả comment hoặc chủ bài)
- 🔍 **Tìm kiếm** theo tiêu đề, lọc theo danh mục, phân trang
- 🏷️ **Tags** cho bài viết

### Hệ thống & UX

- 🌗 **Dark / Light mode** — toggle ở Navbar, persist localStorage, chống FOUC khi refresh
- 🎨 **Modal composer** tạo bài (kiểu Facebook) với TipTap editor
- ✨ Animation chuyển trang mượt mà
- 📱 **Responsive** trên mọi thiết bị
- 🛡️ **Phân quyền** (user / admin)

### Admin Dashboard (`/admin`)

- 📊 **Thống kê** — tổng user, post, comment, lượt thích
- 👥 **Quản lý người dùng** — tìm kiếm, đổi role (user ↔ admin), xóa (cascade post + comment)
- 📝 **Quản lý bài viết** — tìm kiếm, xem, xóa (cascade comment)
- 💬 **Quản lý bình luận** — tìm kiếm, xem post gốc, xóa

### Realtime

- 📊 **Cập nhật số liệu cộng đồng** qua Socket.io (`community:update`)

### Bảo mật

- 🧹 **HTML Sanitization** — `sanitize-html` strip XSS, giữ tag được phép cho content bài viết
- 🔒 **JWT auth** + role-based middleware (`protect`, `requireAdmin`)

---

## Tech stack

### Backend

| Thành phần | Công nghệ               |
| ---------- | ----------------------- |
| Runtime    | Node.js 18+             |
| Framework  | Express 5               |
| Database   | MongoDB 6+ (Mongoose 9) |
| Auth       | JWT + bcryptjs          |
| Validation | express-validator       |
| Upload     | Multer                  |
| Realtime   | Socket.io 4             |
| Sanitize   | sanitize-html           |

### Frontend

| Thành phần   | Công nghệ                                |
| ------------ | ---------------------------------------- |
| Framework    | React 18                                 |
| Build tool   | Vite 5                                   |
| Routing      | React Router DOM 6                       |
| State        | Zustand 4 (persist) — auth + theme       |
| HTTP         | Axios 1.6                                |
| Form         | React Hook Form 7 + Zod 3                |
| Styling      | Tailwind CSS 3 (dark mode: `class`)      |
| Rich Text    | TipTap (StarterKit + Link + Placeholder) |
| Icons        | Lucide React                             |
| Notification | React Hot Toast                          |

---

## Kiến trúc

```
┌────────────────────┐ HTTP/REST ┌────────────────────┐
│ React (Vite) :5173 │ ◄──────► │ Express :5000 │
│ - React Router │ │ - REST API │
│ - Zustand store │ │ - JWT auth + role │
│ - TipTap RTE │ │ - Multer upload │
│ - Dark mode │ │ - sanitize-html │
│ └──── Socket.io ◄──────────────► Socket.io │
└────────────────────┘ └─────────┬─────────┘
 │ │
 │ Mongoose │
 │ │
 ┌────▼────────────────────┐
 │ MongoDB :27017 │
 │ - users (+ role) │
 │ - posts (HTML content) │
 │ - comments │
 └────────────────────────┘
```

- **Frontend** gọi REST API qua Axios (kèm JWT trong header `Authorization`)
- **Static files** (avatar, cover) serve qua `/uploads/...`
- **Realtime**: Server emit `community:update` sau mỗi hành động tạo user/post/comment
- **TipTap** output HTML → lưu vào `post.content` → render bằng `dangerouslySetInnerHTML` + `prose` class → sanitize ở backend

---

## Yêu cầu môi trường

Trước khi bắt đầu, đảm bảo máy bạn đã cài:

| Phần mềm    | Phiên bản                         | Kiểm tra        |
| ----------- | --------------------------------- | --------------- |
| **Node.js** | >= 18                             | `node -v`       |
| **npm**     | >= 9 (đi kèm Node)                | `npm -v`        |
| **MongoDB** | >= 6 (local) hoặc tài khoản Atlas | `mongosh`       |
| **Git**     | mới nhất                          | `git --version` |

> **MongoDB Atlas (miễn phí)**: Nếu không muốn cài MongoDB local, đăng ký tại [mongodb.com/atlas](https://www.mongodb.com/atlas), tạo cluster free và lấy connection string.

---

## Hướng dẫn cài đặt

### Bước 1 — Clone repository

```bash
git clone <repository-url>
cd web
```

### Bước 2 — Cài dependencies

```bash
# Terminal 1 — Backend
cd backend
npm install

# Terminal 2 — Frontend
cd frontend
npm install
```

### Bước 3 — Cấu hình biến môi trường

#### Backend — `backend/.env`

Tạo file (copy từ `.env.example` nếu có):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/web_db
JWT_SECRET=your_secret_key_change_me_in_production
NODE_ENV=development

# Auto-seed admin (optional — đã có default)
ADMIN_EMAIL=admin@blogviet.vn
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin
```

> 💡 **Generate JWT_SECRET mạnh** (production):
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

Nếu dùng **MongoDB Atlas**:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/web_db?retryWrites=true&w=majority
```

#### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> Sửa nếu backend chạy ở host/port khác.

---

## Chạy dự án

Bạn cần **2 terminal** chạy song song.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Output mong đợi:

```
◇ injected env (4) from .env
Server running on port 5000
MongoDB connected: localhost
[seed] Default admin created — email: admin@blogviet.vn | password: admin123
```

> Admin mặc định tự động tạo lần đầu chạy server. Lần sau sẽ skip.

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

App chạy ở **http://localhost:5173**. Mở trình duyệt, truy cập — bạn sẽ thấy trang chủ BlogViet. 🎉

### Health check

```bash
curl http://localhost:5000/api/health
# → { "status": "OK" }
```

### Build production

```bash
# Frontend
cd frontend
npm run build
# Output: dist/ — serve qua Nginx, Vercel, Netlify...

# Backend
cd ../backend
npm start
```

---

## Tài khoản demo

### Admin mặc định (auto-seed)

| Email               | Mật khẩu   | Quyền |
| ------------------- | ---------- | ----- |
| `admin@blogviet.vn` | `admin123` | admin |

> ⚠️ **Đổi mật khẩu admin trong production** qua `ADMIN_PASSWORD` env hoặc đăng nhập rồi đổi.

### User thường

Tự đăng ký qua form `/register`, hoặc tạo qua Postman. Mặc định role = `user`.

### Test nhanh quyền admin

1. Đăng nhập `admin@blogviet.vn` / `admin123`
2. Navbar hiển thị link **🛡️ Admin**
3. Click → `/admin` với 4 tab: Thống kê / Người dùng / Bài viết / Bình luận

---

## Cấu trúc thư mục

```
web/
├── README.md
├── .gitignore
│
├── backend/ # Node.js + Express API
│ ├── README.md
│ ├── .env
│ ├── BlogViet-API.postman_collection.json
│ ├── package.json
│ ├── uploads/ # avatars/, covers/ — gitignored
│ └── src/
│ ├── server.js # Mount routes + Socket.io + seed
│ ├── socket.js
│ ├── config/db.js
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── postController.js
│ │ ├── commentController.js
│ │ ├── communityController.js
│ │ └── adminController.js
│ ├── middleware/
│ │ ├── auth.js # protect + requireAdmin
│ │ ├── generateToken.js
│ │ ├── validators.js
│ │ ├── errorHandler.js
│ │ ├── upload.js
│ │ └── uploadCover.js
│ ├── models/
│ │ ├── User.js # + role
│ │ ├── Post.js
│ │ └── Comment.js
│ ├── routes/
│ │ ├── auth.js
│ │ ├── posts.js
│ │ ├── comments.js
│ │ ├── community.js
│ │ └── admin.js
│ └── utils/
│ ├── communityStats.js # emit helper
│ └── seedAdmin.js # auto-seed admin
│
└── frontend/ # React + Vite SPA
 ├── README.md
 ├── .env
 ├── index.html # + inline theme bootstrap
 ├── package.json
 ├── tailwind.config.js # darkMode: 'class'
 └── src/
 ├── main.jsx
 ├── App.jsx # useLayoutEffect apply theme
 ├── components/
 │ ├── common/
 │ │ ├── Navbar.jsx # + ThemeToggle + Admin link
 │ │ ├── ProtectedRoute.jsx
 │ │ ├── AdminRoute.jsx
 │ │ ├── ThemeToggle.jsx
 │ │ ├── RichTextEditor.jsx # TipTap wrapper
 │ │ ├── LoadingSpinner.jsx
 │ │ ├── Pagination.jsx
 │ │ ├── Avatar.jsx
 │ │ └── AvatarUploader.jsx
 │ ├── posts/
 │ │ ├── PostCard.jsx
 │ │ ├── PostForm.jsx # + RichTextEditor
 │ │ └── PostComposer.jsx # + RichTextEditor
 │ └── comments/
 │ └── CommentSection.jsx
 ├── pages/
 │ ├── HomePage.jsx
 │ ├── PostDetailPage.jsx
 │ ├── LoginPage.jsx
 │ ├── RegisterPage.jsx
 │ ├── CreatePostPage.jsx
 │ ├── EditPostPage.jsx
 │ ├── ProfilePage.jsx
 │ ├── EditProfilePage.jsx
 │ ├── NotFoundPage.jsx
 │ └── admin/ # Admin Dashboard
 │ ├── AdminDashboardPage.jsx
 │ ├── AdminStats.jsx
 │ ├── AdminUsers.jsx
 │ ├── AdminPosts.jsx
 │ └── AdminComments.jsx
 ├── services/
 │ ├── api.js
 │ ├── authService.js
 │ ├── postService.js
 │ ├── commentService.js
 │ └── adminService.js
 ├── stores/
 │ ├── useAuthStore.js # user, token, isAdmin()
 │ └── useThemeStore.js # theme, toggle, persist
 └── utils/
 └── helpers.js # + getAvatarUrl
```

---

## Tài liệu liên quan

- [Backend API documentation](backend/README.md) — endpoints, models, error handling
- [Frontend documentation](frontend/README.md) — components, routing, design system
- [Postman collection](backend/BlogViet-API.postman_collection.json) — test API
- [Express.js docs](https://expressjs.com/)
- [React docs](https://react.dev/)
- [MongoDB docs](https://www.mongodb.com/docs/)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [TipTap docs](https://tiptap.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.io](https://socket.io/docs/)

---
