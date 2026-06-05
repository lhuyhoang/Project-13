# BlogViet — Frontend

Giao diện người dùng cho nền tảng blog, xây dựng bằng **React 18 + Vite + Tailwind CSS**, quản lý state với **Zustand**.

---

## Mục lục

- [Tính năng](#tính-năng)
- [Tech stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [Scripts](#scripts)
- [Routing](#routing)
- [State management](#state-management)
- [Design system](#design-system)
- [Tác giả](#tác-giả)

---

## Tính năng

### Người dùng (chưa đăng nhập)
- Xem danh sách bài viết (phân trang, tìm kiếm, lọc theo danh mục)
- Xem chi tiết bài viết + bình luận
- Đăng ký / Đăng nhập

### Người dùng (đã đăng nhập)
- Tất cả tính năng trên
- Tạo bài viết (modal composer kiểu Facebook, có ảnh bìa)
- Chỉnh sửa / xóa bài viết của mình
- Thích / bỏ thích bài viết
- Bình luận, xóa comment của mình (hoặc xóa comment trong bài của mình)
- **Trang cá nhân** (`/profile`): thông tin user + danh sách bài viết
- **Chỉnh sửa hồ sơ** (`/edit-profile`): username, bio, mật khẩu, **upload avatar**

### Realtime
- Cập nhật số liệu cộng đồng (users, posts, comments) qua Socket.io

---

## Tech stack

| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router DOM 6 |
| State | Zustand 4 (với persist middleware) |
| HTTP client | Axios 1.6 |
| Form & Validation | React Hook Form 7 + Zod 3 |
| Styling | Tailwind CSS 3 (custom theme `ink`/`amber`) |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Date utils | Native `Intl` + custom helpers |

---

## Cấu trúc thư mục

```
frontend/
├── .env.example # Mẫu biến môi trường
├── .gitignore
├── index.html # HTML entry, load Google Fonts
├── package.json
├── vite.config.js # Vite config + dev proxy
├── tailwind.config.js # Custom theme
├── postcss.config.js
└── src/
 ├── main.jsx # Entry — mount <App/>, Toaster
 ├── App.jsx # Định nghĩa toàn bộ routes
 ├── index.css # Tailwind + custom classes (.btn-primary, .card, ...)
 │
 ├── components/
 │ ├── common/ # Dùng chung toàn app
 │ │ ├── Navbar.jsx
 │ │ ├── ProtectedRoute.jsx
 │ │ ├── LoadingSpinner.jsx # + PostCardSkeleton, PostDetailSkeleton
 │ │ ├── Pagination.jsx
 │ │ ├── Avatar.jsx # Hiển thị avatar (ảnh hoặc chữ cái đầu)
 │ │ └── AvatarUploader.jsx # Chọn + preview + upload avatar
 │ ├── posts/
 │ │ ├── PostCard.jsx # Card bài viết ở HomePage
 │ │ ├── PostForm.jsx # Form chỉnh sửa bài viết
 │ │ └── PostComposer.jsx # Modal tạo bài (Facebook-style)
 │ └── comments/
 │ └── CommentSection.jsx
 │
 ├── pages/
 │ ├── HomePage.jsx
 │ ├── PostDetailPage.jsx
 │ ├── LoginPage.jsx
 │ ├── RegisterPage.jsx
 │ ├── CreatePostPage.jsx # Mở PostComposer
 │ ├── EditPostPage.jsx # Dùng PostForm
 │ ├── ProfilePage.jsx
 │ ├── EditProfilePage.jsx # Sửa profile + avatar + password
 │ └── NotFoundPage.jsx
 │
 ├── hooks/
 │ └── usePosts.js # Custom hook fetch posts (pagination/search/filter)
 │
 ├── services/ # Gọi API backend
 │ ├── api.js # Axios instance + interceptors
 │ ├── authService.js
 │ ├── postService.js
 │ └── commentService.js
 │
 ├── stores/ # Zustand stores
 │ └── useAuthStore.js # user, token, login, register, logout, updateUser
 │
 └── utils/
 └── helpers.js # formatDate, truncate, estimateReadTime, getInitial, getErrorMessage
```

---

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18
- **npm** hoặc **yarn**
- Backend đang chạy ở `http://localhost:5000` (xem [backend README](../backend/README.md))

### Bước 1 — Cài dependencies

```bash
cd frontend
npm install
```

### Bước 2 — Tạo file `.env`

```bash
cp .env.example .env
```

Mặc định trỏ về `http://localhost:5000/api`. Sửa lại nếu backend chạy ở host/port khác.

### Bước 3 — Chạy dev server

```bash
npm run dev
# → http://localhost:5173
```

Vite có sẵn **proxy** cho `/api` → `http://localhost:5000`, nên không lo CORS trong dev mode.

### Bước 4 — Build production

```bash
npm run build
# Output trong dist/
```

Preview bản build:

```bash
npm run preview
```

---

## Biến môi trường

| Biến | Bắt buộc | Mặc định | Mô tả |
|------|----------|----------|-------|
| `VITE_API_URL` | Không | `http://localhost:5000/api` | Base URL cho backend API |

> Lưu ý: Mọi biến môi trường phải có prefix `VITE_` để Vite expose ra client (theo [Vite env docs](https://vitejs.dev/guide/env-and-mode.html)).

---

## Scripts

```bash
npm run dev # Chạy dev server với HMR (port 5173)
npm run build # Build production ra dist/
npm run preview # Preview bản build
npm run lint # Chạy ESLint
```

---

## Routing

Định nghĩa trong [`src/App.jsx`](src/App.jsx).

### Public routes

| Path | Page | Mô tả |
|------|------|-------|
| `/` | `HomePage` | Danh sách bài viết |
| `/posts/:id` | `PostDetailPage` | Chi tiết bài viết + comments |
| `/login` | `LoginPage` | Đăng nhập |
| `/register` | `RegisterPage` | Đăng ký |
| `/404` | `NotFoundPage` | Trang lỗi 404 |
| `*` | → `/404` | Bắt mọi route không khớp |

### Protected routes (cần đăng nhập)

Bọc trong `<ProtectedRoute>` → redirect về `/login` nếu chưa có `token + user` trong store.

| Path | Page |
|------|------|
| `/create-post` | `CreatePostPage` (mở modal `PostComposer`) |
| `/edit-post/:id` | `EditPostPage` |
| `/profile` | `ProfilePage` |
| `/edit-profile` | `EditProfilePage` |

---

## State management

Dùng **Zustand** với `persist` middleware — state được tự động lưu vào `localStorage` dưới key `auth-storage`.

### `useAuthStore` (src/stores/useAuthStore.js)

```js
const user  = useAuthStore(s => s.user) // { _id, username, email, avatar, bio, createdAt }
const token = useAuthStore(s => s.token)

// Actions
login(credentials) // POST /auth/login
register(data) // POST /auth/register
logout() // Clear store + localStorage
updateUser(updated) // Sync store sau khi edit profile
```

### Cơ chế persist

```js
persist(state, {
 name: 'auth-storage',
 partialize: (s) => ({ user: s.user, token: s.token }),
})
```

Chỉ persist `user` + `token`, **không** persist `isLoading` / `error` (tránh stale state khi reload).

### Axios interceptor (src/services/api.js)

- **Request**: tự động gắn `Authorization: Bearer <token>` từ localStorage
- **Response**: nếu 401 → xóa token + redirect về `/login`

---

## Design system

Tailwind CSS với custom theme định nghĩa trong `tailwind.config.js`.

### Bảng màu

| Token | Mục đích |
|-------|----------|
| `ink-50` → `ink-950` | Tone màu chính (nâu đất) — text, background, border |
| `amber-400` → `amber-600` | Màu nhấn (CTA, link, focus) |

### Font

| Token | Font | Mục đích |
|-------|------|----------|
| `font-display` | Playfair Display | Tiêu đề (heading) |
| `font-body` | DM Sans | Nội dung thường |
| `font-mono` | JetBrains Mono | Code, ID, debug |

Load qua Google Fonts trong `index.html`.

### Custom utility classes (src/index.css)

```css
.btn-primary /* Nút chính (đen, hover sáng) */
.btn-secondary /* Nút phụ (viền) */
.btn-danger /* Nút xóa (đỏ) */
.input-field /* Input/textarea/select */
.input-error /* Input có lỗi validation */
.card /* Container có shadow + hover effect */
.badge /* Chip danh mục (vàng) */
.skeleton /* Loading placeholder */
.page-enter /* Animation fade-in cho page */
```

---

## Conventions

### Naming
- **Component**: PascalCase (`PostCard.jsx`, `useAuthStore.js`)
- **Hook**: camelCase, prefix `use` (`usePosts.js`)
- **Service**: camelCase, suffix `Service` (`authService.js`)
- **Constant**: UPPER_SNAKE_CASE (cho mảng enum)

### State updates
- Luôn dùng **selector** để subscribe: `useAuthStore(s => s.user)` thay vì `useAuthStore()`
- Tránh re-render không cần thiết

### API call
- Mọi HTTP request đi qua `services/*Service.js`
- KHÔNG gọi `axios.get(...)` trực tiếp trong component
- Service throw error, component bắt và hiển thị toast

### Form
- Dùng **react-hook-form** + **Zod** resolver
- Validation schema đặt ngay đầu file component
- Disable nút Submit khi `isLoading`
