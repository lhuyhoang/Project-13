# BlogViet — Frontend

Giao diện người dùng cho nền tảng blog BlogViet, xây dựng bằng **React 18 + Vite + Tailwind CSS**, tích hợp **TipTap rich text editor**, **dark/light mode**, **Admin Dashboard**, quản lý state với **Zustand**.

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
- [Rich Text Editor (TipTap)](#rich-text-editor-tiptap)
- [Dark / Light mode](#dark--light-mode)
- [Admin Dashboard](#admin-dashboard)
- [Design system](#design-system)
- [Conventions](#conventions)

---

## Tính năng

### Người dùng (chưa đăng nhập)

- Xem danh sách bài viết (phân trang, tìm kiếm, lọc theo danh mục)
- Xem chi tiết bài viết + bình luận
- Đăng ký / Đăng nhập

### Người dùng (đã đăng nhập)

- Tất cả tính năng trên
- **Tạo bài viết** với **TipTap rich text editor** (Bold, Italic, Headings, List, Code, Link, Quote, Divider…)
- Modal composer kiểu Facebook, có ảnh bìa, danh mục, tags
- Chỉnh sửa / xóa bài viết của mình
- Thích / bỏ thích bài viết
- Bình luận, xóa comment của mình (hoặc comment trong bài của mình)
- **Trang cá nhân** (`/profile`): thông tin user + danh sách bài viết
- **Chỉnh sửa hồ sơ** (`/edit-profile`): username, bio, mật khẩu, **upload avatar**

### Hệ thống

- 🌗 **Dark / Light mode** — toggle ở Navbar, persist localStorage
- 🛡️ **Phân quyền** — link Admin chỉ hiện với `role: 'admin'`
- 📊 **Realtime stats** qua Socket.io

### Admin (role = `admin`)

- **Dashboard** (`/admin`) với 4 tab:
- **Thống kê** — tổng user, post, comment, likes
- **Người dùng** — tìm kiếm, đổi role, xóa (cascade)
- **Bài viết** — tìm kiếm, xem, xóa (cascade)
- **Bình luận** — tìm kiếm, xem post gốc, xóa

---

## Tech stack

| Thành phần        | Công nghệ                                             |
| ----------------- | ----------------------------------------------------- |
| Framework         | React 18                                              |
| Build tool        | Vite 5                                                |
| Routing           | React Router DOM 6                                    |
| State             | Zustand 4 (persist) — `useAuthStore`, `useThemeStore` |
| HTTP client       | Axios 1.6                                             |
| Form & Validation | React Hook Form 7 + Zod 3                             |
| Rich Text         | TipTap (StarterKit + Link + Placeholder)              |
| Styling           | Tailwind CSS 3 (dark mode: `class`)                   |
| Icons             | Lucide React                                          |
| Notifications     | React Hot Toast                                       |
| Date utils        | Native `Intl` + custom helpers                        |

---

## Cấu trúc thư mục

```
frontend/
├── .env.example
├── .gitignore
├── index.html # + inline theme bootstrap (chống FOUC)
├── package.json
├── vite.config.js
├── tailwind.config.js # darkMode: 'class'
├── postcss.config.js
└── src/
 ├── main.jsx # Mount <App/> + Toaster
 ├── App.jsx # Routes + useLayoutEffect apply theme
 ├── index.css # Tailwind + custom classes
 │
 ├── components/
 │ ├── common/ # Dùng chung
 │ │ ├── Navbar.jsx # + ThemeToggle + Admin link
 │ │ ├── ProtectedRoute.jsx
 │ │ ├── AdminRoute.jsx # Check role admin
 │ │ ├── ThemeToggle.jsx # Sun/Moon button
 │ │ ├── RichTextEditor.jsx # TipTap wrapper
 │ │ ├── LoadingSpinner.jsx # + skeletons
 │ │ ├── Pagination.jsx
 │ │ ├── Avatar.jsx
 │ │ └── AvatarUploader.jsx
 │ ├── posts/
 │ │ ├── PostCard.jsx
 │ │ ├── PostForm.jsx # + TipTap
 │ │ └── PostComposer.jsx # + TipTap
 │ └── comments/
 │ └── CommentSection.jsx
 │
 ├── pages/
 │ ├── HomePage.jsx
 │ ├── PostDetailPage.jsx # + render HTML bằng prose
 │ ├── LoginPage.jsx
 │ ├── RegisterPage.jsx
 │ ├── CreatePostPage.jsx
 │ ├── EditPostPage.jsx
 │ ├── ProfilePage.jsx
 │ ├── EditProfilePage.jsx
 │ ├── NotFoundPage.jsx
 │ └── admin/
 │ ├── AdminDashboardPage.jsx # Layout + 4 tab
 │ ├── AdminStats.jsx
 │ ├── AdminUsers.jsx
 │ ├── AdminPosts.jsx
 │ └── AdminComments.jsx
 │
 ├── hooks/
 │ └── usePosts.js
 │
 ├── services/ # Gọi API
 │ ├── api.js # Axios instance + interceptors
 │ ├── authService.js
 │ ├── postService.js
 │ ├── commentService.js
 │ └── adminService.js
 │
 ├── stores/ # Zustand
 │ ├── useAuthStore.js # user, token, isAdmin()
 │ └── useThemeStore.js # theme, toggle, persist
 │
 └── utils/
 └── helpers.js # formatDate, truncate, getAvatarUrl, ...
```

---

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18
- **npm** hoặc **yarn**
- Backend đang chạy ở `http://localhost:5000` — xem [backend README](../backend/README.md)

### Bước 1 — Cài dependencies

```bash
cd frontend
npm install
```

### Bước 2 — Tạo file `.env`

```bash
cp .env.example .env
```

Mặc định:

```env
VITE_API_URL=http://localhost:5000/api
```

### Bước 3 — Chạy dev server

```bash
npm run dev
# → http://localhost:5173
```

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

| Biến           | Bắt buộc | Mặc định                    | Mô tả                    |
| -------------- | -------- | --------------------------- | ------------------------ |
| `VITE_API_URL` | Không    | `http://localhost:5000/api` | Base URL cho backend API |

> Mọi biến môi trường phải có prefix `VITE_` (xem [Vite env docs](https://vitejs.dev/guide/env-and-mode.html)).

---

## Scripts

```bash
npm run dev # Dev server với HMR (port 5173)
npm run build # Build production → dist/
npm run preview # Preview bản build
```

---

## Routing

Định nghĩa trong [`src/App.jsx`](src/App.jsx).

### Public routes

| Path         | Page             | Mô tả               |
| ------------ | ---------------- | ------------------- |
| `/`          | `HomePage`       | Danh sách bài viết  |
| `/posts/:id` | `PostDetailPage` | Chi tiết + comments |
| `/login`     | `LoginPage`      | Đăng nhập           |
| `/register`  | `RegisterPage`   | Đăng ký             |
| `/404`       | `NotFoundPage`   | Trang lỗi           |
| `*`          | → `/404`         | Catch-all           |

### Protected routes (cần đăng nhập)

Bọc trong `<ProtectedRoute>` → redirect `/login` nếu chưa có `token + user`.

| Path             | Page              |
| ---------------- | ----------------- |
| `/create-post`   | `CreatePostPage`  |
| `/edit-post/:id` | `EditPostPage`    |
| `/profile`       | `ProfilePage`     |
| `/edit-profile`  | `EditProfilePage` |

### Admin routes (cần `role: 'admin'`)

Bọc trong `<AdminRoute>` → 401 nếu chưa login, hiển thị "Không có quyền" nếu không phải admin.

| Path     | Page                                                              |
| -------- | ----------------------------------------------------------------- |
| `/admin` | `AdminDashboardPage` (4 tab: Thống kê / Users / Posts / Comments) |

---

## State management

Zustand với `persist` middleware, lưu vào `localStorage`.

### `useAuthStore` (`src/stores/useAuthStore.js`)

```js
const user = useAuthStore((s) => s.user); // { _id, username, email, avatar, bio, role, createdAt }
const token = useAuthStore((s) => s.token);
const isAdmin = useAuthStore((s) => s.isAdmin); // () => user.role === 'admin'

// Actions
login(credentials);
register(data);
logout();
updateUser(updated); // Sync store sau khi edit profile
```

**Persist key:** `auth-storage`
**Persisted:** `user` + `token` (không persist `isLoading` / `error`)

### `useThemeStore` (`src/stores/useThemeStore.js`)

```js
const theme = useThemeStore((s) => s.theme); // 'light' | 'dark'
const toggle = useThemeStore((s) => s.toggle);
const setTheme = useThemeStore((s) => s.setTheme);
```

**Persist key:** `theme-storage`
**Class application:** `useLayoutEffect` ở `App.jsx` add/remove class `dark` trên `<html>`

### Axios interceptor (`src/services/api.js`)

- **Request**: tự động gắn `Authorization: Bearer <token>` từ localStorage
- **Response**: nếu 401 → xóa token + redirect về `/login`

---

## Rich Text Editor (TipTap)

Component: `src/components/common/RichTextEditor.jsx`

Wrapper quanh TipTap với toolbar đầy đủ:

| Nhóm              | Nút                               |
| ----------------- | --------------------------------- |
| **Inline format** | Bold, Italic, Strikethrough, Code |
| **Headings**      | H2, H3                            |
| **List**          | Bullet list, Numbered list        |
| **Block**         | Quote, Code block, Divider        |
| **Link**          | Prompt URL                        |
| **History**       | Undo, Redo                        |

**Props:**

```jsx
<RichTextEditor
  value={html}
  onChange={(html) => setHtml(html)}
  placeholder="Bắt đầu viết..."
  minHeight="min-h-[200px]"
/>
```

**Cách tích hợp:**

1. **PostComposer** (modal tạo bài) — thay `<textarea>`
2. **PostForm** (sửa bài) — thay `<textarea>`, sync với react-hook-form qua `setValue('content', html)`
3. **PostDetailPage** — render `dangerouslySetInnerHTML` + `prose prose-ink` class

**Bảo mật:** Backend dùng `sanitize-html` strip XSS trước khi lưu — chỉ giữ tag an toàn (p, h2, h3, ul, ol, li, code, pre, blockquote, hr, a). `<script>`, `onclick`, `javascript:` href đều bị chặn.

**Helper `getAvatarUrl`** (trong `utils/helpers.js`): tự join `VITE_API_URL.replace('/api', '')` + đường dẫn `/uploads/...` để hiển thị ảnh upload.

---

## Dark / Light mode

### Cơ chế

| Layer         | Xử lý                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------- |
| **Config**    | `tailwind.config.js` → `darkMode: 'class'`                                                     |
| **Bootstrap** | `index.html` inline script đọc localStorage, add class `dark` **trước khi paint** (chống FOUC) |
| **State**     | `useThemeStore` lưu `theme: 'light' \| 'dark'`, persist localStorage                           |
| **Reactive**  | `App.jsx` dùng `useLayoutEffect` add/remove class khi `theme` đổi                              |
| **UI**        | Component dùng `dark:` variants (vd: `bg-white dark:bg-ink-900`)                               |

### Toggle

`src/components/common/ThemeToggle.jsx` — nút Sun/Moon ở Navbar (desktop + mobile menu).

### Component patterns

```jsx
// Background + text
className = "bg-white dark:bg-ink-900 text-ink-900 dark:text-ink-50";

// Border
className = "border border-ink-200 dark:border-ink-800";

// Hover
className = "hover:bg-ink-50 dark:hover:bg-ink-800";

// Transition mượt
className = "transition-colors duration-300";
```

### Test

1. Click nút Sun/Moon → dark/light
2. Refresh → giữ nguyên theme, **không flash trắng** (FOUC fix)
3. Navbar, PostCard, Admin Dashboard đều có dark variants

---

## Admin Dashboard

Route: `/admin` (yêu cầu `role: 'admin'`)

### Layout

`AdminDashboardPage.jsx` — sidebar tabs (4) + main content area.

### 4 Tab

#### 1. **Thống kê** (`AdminStats.jsx`)

4 card chỉ số tổng: users, posts, comments, likes + 2 panel (admin count, recent users).

API: `GET /api/admin/stats`

#### 2. **Người dùng** (`AdminUsers.jsx`)

Bảng user với:

- Search theo username / email
- Phân trang (20/trang)
- Đổi role (icon Shield ↔ User) — confirm trước khi đổi
- Xóa user (icon Trash) — confirm + cảnh báo cascade post + comment

API: `GET /admin/users`, `PATCH /admin/users/:id/role`, `DELETE /admin/users/:id`

#### 3. **Bài viết** (`AdminPosts.jsx`)

List bài viết với:

- Search theo title
- Phân trang
- Ảnh cover thumbnail (nếu có)
- Tác giả, ngày, số like
- Xem bài (Eye) / Xóa bài (Trash)

API: `GET /admin/posts`, `DELETE /admin/posts/:id`

#### 4. **Bình luận** (`AdminComments.jsx`)

List comment với:

- Search theo nội dung
- Phân trang
- Tên tác giả, ngày
- Link tới post gốc
- Xóa comment

API: `GET /admin/comments`, `DELETE /admin/comments/:id`

### Service

`src/services/adminService.js` — wrapper cho 8 admin endpoints.

### Test admin

```bash
# Login admin
POST /api/auth/login
{ "email": "admin@blogviet.vn", "password": "admin123" }
# → token

# Test API
GET /api/admin/stats
Authorization: Bearer <token>
```

Hoặc trong UI: đăng nhập admin → Navbar hiện link "🛡️ Admin" → click vào `/admin`.

---

## Design system

Tailwind CSS với custom theme định nghĩa trong `tailwind.config.js`.

### Bảng màu

| Token                     | Mục đích                                            |
| ------------------------- | --------------------------------------------------- |
| `ink-50` → `ink-950`      | Tone màu chính (nâu đất) — text, background, border |
| `amber-400` → `amber-600` | Màu nhấn (CTA, link, focus)                         |

### Font

| Token          | Font             | Mục đích |
| -------------- | ---------------- | -------- |
| `font-display` | Playfair Display | Heading  |
| `font-body`    | DM Sans          | Body     |
| `font-mono`    | JetBrains Mono   | Code, ID |

Load qua Google Fonts trong `index.html`.

### Custom utility classes (`src/index.css`)

```css
.btn-primary /* Nút chính */
.btn-secondary /* Nút phụ */
.btn-danger /* Nút xóa */
.input-field /* Input/textarea/select */
.input-error /* Input lỗi */
.card /* Container có shadow */
.badge /* Chip danh mục */
.skeleton /* Loading placeholder */
.page-enter /* Animation fade-in */
```

### Dark mode pattern

```jsx
// Background
"bg-white dark:bg-ink-900";

// Text
"text-ink-900 dark:text-ink-50";

// Sub-text
"text-ink-500 dark:text-ink-400";

// Border
"border-ink-200 dark:border-ink-800";

// Hover state
"hover:bg-ink-50 dark:hover:bg-ink-800";

// Input
"dark:bg-ink-800 dark:text-ink-100 dark:border-ink-700";
```

---

## Conventions

### Naming

- **Component**: PascalCase (`PostCard.jsx`, `useAuthStore.js`)
- **Hook**: camelCase, prefix `use` (`usePosts.js`)
- **Service**: camelCase, suffix `Service` (`authService.js`)
- **Constant**: UPPER_SNAKE_CASE (cho enum arrays)

### State updates

- Luôn dùng **selector**: `useAuthStore(s => s.user)` — KHÔNG dùng `useAuthStore()` thẳng
- Tránh re-render không cần thiết

### API call

- Mọi HTTP request qua `services/*Service.js`
- KHÔNG gọi `axios.get(...)` trực tiếp trong component
- Service throw error, component bắt và hiển thị toast

### Form

- **react-hook-form** + **Zod** resolver
- Validation schema đặt ngay đầu file
- Disable nút Submit khi `isLoading`

### Rich text

- Luôn dùng `RichTextEditor` thay `<textarea>` cho content bài viết
- Render HTML ở `PostDetailPage` bằng `dangerouslySetInnerHTML` — backend đã sanitize

### Dark mode

- Mỗi component có bg/text cần thêm `dark:` variant
- Pattern: `bg-white dark:bg-ink-900` (light → dark)
- Dùng `transition-colors duration-200` để chuyển mượt
