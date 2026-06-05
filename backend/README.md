# BlogViet — Backend API

RESTful API cho nền tảng blog BlogViet, xây dựng bằng **Node.js + Express + MongoDB**, hỗ trợ xác thực JWT, phân quyền admin, rich text content (HTML), realtime qua Socket.io, và sanitize chống XSS.

---

## Mục lục

- [Tech stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [API Endpoints](#api-endpoints)
  - [Auth](#authentication)
  - [Posts](#posts)
  - [Comments](#comments)
  - [Community](#community-stats)
  - [Admin](#admin-yêu-cầu-role--admin)
- [Models (Schemas)](#models-schemas)
- [Middleware](#middleware)
- [Xử lý lỗi](#xử-lý-lỗi)
- [Upload file](#upload-file)
- [Sanitize HTML](#sanitize-html)
- [Socket.io](#socketio)
- [Auto-seed admin](#auto-seed-admin)
- [Scripts](#scripts)
- [Postman collection](#postman-collection)

---

## Tech stack

| Thành phần | Công nghệ                                    |
| ---------- | -------------------------------------------- |
| Runtime    | Node.js 18+                                  |
| Framework  | Express 5                                    |
| Database   | MongoDB 6+                                   |
| ODM        | Mongoose 9                                   |
| Auth       | JWT (jsonwebtoken) + bcryptjs                |
| Role       | Custom middleware `protect` + `requireAdmin` |
| Validation | express-validator                            |
| Upload     | Multer (diskStorage)                         |
| Sanitize   | sanitize-html (giữ tag TipTap an toàn)       |
| Realtime   | Socket.io 4                                  |
| Dev tool   | Nodemon                                      |

---

## Cấu trúc thư mục

```
backend/
├── .env.example
├── .gitignore
├── BlogViet-API.postman_collection.json
├── package.json
├── uploads/ # Tự tạo lúc chạy
│ ├── avatars/
│ └── covers/
└── src/
 ├── server.js # Mount routes + Socket.io + seed
 ├── socket.js
 ├── config/
 │ └── db.js
 ├── controllers/
 │ ├── authController.js # + updateProfile, changePassword, updateAvatar
 │ ├── postController.js # + getMyPosts, uploadCoverImage
 │ ├── commentController.js
 │ ├── communityController.js
 │ └── adminController.js # Thống kê + CRUD users/posts/comments
 ├── middleware/
 │ ├── auth.js # protect + requireAdmin
 │ ├── generateToken.js
 │ ├── validators.js # + postValidator (strip HTML check)
 │ ├── errorHandler.js
 │ ├── upload.js # Avatar (2MB)
 │ └── uploadCover.js # Cover (5MB)
 ├── models/
 │ ├── User.js # + role enum
 │ ├── Post.js
 │ └── Comment.js
 ├── routes/
 │ ├── auth.js
 │ ├── posts.js
 │ ├── comments.js
 │ ├── community.js
 │ └── admin.js # /api/admin/* — protect + requireAdmin
 └── utils/
 ├── communityStats.js # emitCommunityStats() helper
 └── seedAdmin.js # Auto-seed admin lúc start
```

---

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18
- **MongoDB** >= 6 (local hoặc Atlas)
- **npm** hoặc **yarn**

### Bước 1 — Cài dependencies

```bash
cd backend
npm install
```

### Bước 2 — Tạo file `.env`

```bash
cp .env.example .env
# hoặc tự tạo với nội dung:
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/web_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development

# Optional — custom admin mặc định
ADMIN_EMAIL=admin@blogviet.vn
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin
```

> **Lưu ý:** Đổi `JWT_SECRET` thành chuỗi random dài trong production:
>
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Bước 3 — Chạy server

```bash
# Dev mode (auto-reload với nodemon)
npm run dev

# Production
npm start
```

Server chạy ở `http://localhost:5000`.

### Output mong đợi

```
◇ injected env (4) from .env
Server running on port 5000
MongoDB connected: localhost
[seed] Default admin created — email: admin@blogviet.vn | password: admin123
```

> Lần đầu chạy sẽ tạo admin mặc định (nếu chưa có). Lần sau skip.

### Kiểm tra nhanh

```bash
curl http://localhost:5000/api/health
# → { "status": "OK" }
```

---

## Biến môi trường

| Biến             | Bắt buộc | Mặc định                | Mô tả                                 |
| ---------------- | -------- | ----------------------- | ------------------------------------- |
| `PORT`           | Không    | `5000`                  | Cổng server                           |
| `MONGO_URI`      | **Có**   | —                       | MongoDB connection string             |
| `JWT_SECRET`     | **Có**   | —                       | Secret ký JWT (đổi trong production!) |
| `NODE_ENV`       | Không    | `development`           | `development` / `production`          |
| `CLIENT_URL`     | Không    | `http://localhost:5173` | CORS origin cho frontend              |
| `ADMIN_EMAIL`    | Không    | `admin@blogviet.vn`     | Email admin auto-seed                 |
| `ADMIN_PASSWORD` | Không    | `admin123`              | Mật khẩu admin auto-seed              |
| `ADMIN_USERNAME` | Không    | `admin`                 | Username admin auto-seed              |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

> 🔒 = cần `Authorization: Bearer <token>` header
> 🛡️ = cần `role: 'admin'`

### Authentication

| Method | Endpoint         | Mô tả                                             | Auth |
| ------ | ---------------- | ------------------------------------------------- | ---- |
| `POST` | `/auth/register` | Đăng ký (mặc định role=`user`)                    |      |
| `POST` | `/auth/login`    | Đăng nhập, trả về JWT                             |      |
| `GET`  | `/auth/me`       | Thông tin user hiện tại                           | 🔒   |
| `PUT`  | `/auth/profile`  | Cập nhật username / bio                           | 🔒   |
| `PUT`  | `/auth/password` | Đổi mật khẩu                                      | 🔒   |
| `POST` | `/auth/avatar`   | Upload avatar (multipart, field: `avatar`, ≤ 2MB) | 🔒   |

**Register request:**

```json
POST /api/auth/register
{
 "username": "testuser",
 "email": "test@example.com",
 "password": "123456"
}
```

**Login response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "avatar": "",
    "bio": "",
    "role": "user",
    "createdAt": "2026-06-05T10:00:00.000Z"
  }
}
```

### Posts

| Method   | Endpoint           | Mô tả                                             | Auth |
| -------- | ------------------ | ------------------------------------------------- | ---- |
| `GET`    | `/posts`           | Danh sách bài viết (phân trang, search, filter)   |      |
| `GET`    | `/posts/me`        | Bài viết của user hiện tại                        | 🔒   |
| `GET`    | `/posts/:id`       | Chi tiết 1 bài viết                               |      |
| `POST`   | `/posts`           | Tạo bài viết (content có thể là HTML từ TipTap)   | 🔒   |
| `PUT`    | `/posts/:id`       | Sửa bài viết (chỉ chủ sở hữu)                     | 🔒   |
| `DELETE` | `/posts/:id`       | Xóa bài viết (chỉ chủ sở hữu)                     | 🔒   |
| `POST`   | `/posts/:id/like`  | Toggle like / unlike                              | 🔒   |
| `POST`   | `/posts/:id/cover` | Upload ảnh bìa (multipart, field: `cover`, ≤ 5MB) | 🔒   |

**Query params `GET /posts`:**

- `page` (mặc định `1`)
- `limit` (mặc định `10`)
- `search` — tìm theo title (case-insensitive regex)
- `category` — filter theo category enum

**Response ví dụ `GET /posts`:**

```json
{
 "success": true,
 "posts": [...],
 "total": 42,
 "currentPage": 1,
 "totalPages": 5,
 "hasNextPage": true
}
```

**Lưu ý về content:** Backend chấp nhận HTML từ TipTap (bold, italic, headings, list, link, code…), **tự động sanitize** qua `sanitize-html` trước khi lưu. Chỉ giữ các tag an toàn — script/iframe/on-event bị strip.

### Comments

| Method   | Endpoint                  | Mô tả                                      | Auth |
| -------- | ------------------------- | ------------------------------------------ | ---- |
| `GET`    | `/posts/:postId/comments` | Lấy comments của 1 bài                     |      |
| `POST`   | `/posts/:postId/comments` | Thêm comment (1–500 ký tự, HTML strip)     | 🔒   |
| `DELETE` | `/comments/:id`           | Xóa comment (tác giả comment hoặc chủ bài) | 🔒   |

### Community Stats

| Method | Endpoint     | Mô tả                        |
| ------ | ------------ | ---------------------------- |
| `GET`  | `/community` | Đếm tổng user, post, comment |

### Admin (yêu cầu role = `admin`)

Tất cả endpoints dưới đây yêu cầu **cả JWT lẫn `role: 'admin'`**. Lỗi 401 nếu thiếu token, 403 nếu không phải admin.

| Method   | Endpoint                | Mô tả                                                                 |
| -------- | ----------------------- | --------------------------------------------------------------------- | ---------- |
| `GET`    | `/admin/stats`          | Thống kê tổng: users, posts, comments, likes, adminCount, recentUsers |
| `GET`    | `/admin/users`          | Danh sách user (search, phân trang)                                   |
| `PATCH`  | `/admin/users/:id/role` | Đổi role user (`{ role: "admin"                                       | "user" }`) |
| `DELETE` | `/admin/users/:id`      | Xóa user (cascade xóa post + comment của họ)                          |
| `GET`    | `/admin/posts`          | Danh sách bài viết (search, phân trang)                               |
| `DELETE` | `/admin/posts/:id`      | Xóa bài viết (cascade xóa comment)                                    |
| `GET`    | `/admin/comments`       | Danh sách bình luận (search, phân trang)                              |
| `DELETE` | `/admin/comments/:id`   | Xóa bình luận                                                         |

**Quy tắc bảo vệ:**

- Admin **không thể tự hạ quyền** chính mình (tránh lockout)
- Admin **không thể tự xóa** chính mình
- Xóa user → cascade xóa toàn bộ post + comment của họ

**Ví dụ `GET /admin/stats`:**

```json
{
 "success": true,
 "stats": {
 "totalUsers": 25,
 "totalPosts": 47,
 "totalComments": 132,
 "totalLikes": 89,
 "adminCount": 1,
 "recentUsers": [...]
 }
}
```

### Health Check

| Method | Endpoint  | Mô tả           |
| ------ | --------- | --------------- |
| `GET`  | `/health` | Server còn sống |

---

## Models (Schemas)

### User

```js
{
 username: String // unique, 3-30 ký tự
 email: String // unique, format email
 password: String // hashed, min 6, select: false
 avatar: String // "/uploads/avatars/xxx"
 bio: String // max 200
 role: String // enum: ['user', 'admin'], default 'user'
 createdAt, updatedAt: Date
}
```

**Methods:** `comparePassword(candidatePassword)`
**Hooks:** `pre('save')` — auto hash password

### Post

```js
{
 title: String // 5-150 ký tự
 content: String // min 20 (sau khi strip HTML)
 summary: String // optional, max 300
 category: String // enum: 'Công nghệ' | 'Lập trình' | ...
 coverImage: String // "/uploads/covers/xxx"
 author: ObjectId // ref: User
 likes: [ObjectId] // ref: User
 tags: [String] // lowercase
 createdAt, updatedAt: Date
}
```

**Virtuals:** `likeCount` (= `likes.length`)
**Indexes:** `title` (text) + `category`, `category`, `author`, `tags`, `createdAt` desc

### Comment

```js
{
 content: String // 1-500 ký tự (HTML strip)
 author: ObjectId // ref: User
 post: ObjectId // ref: Post
 createdAt, updatedAt: Date
}
```

---

## Middleware

| File               | Chức năng                                                                      |
| ------------------ | ------------------------------------------------------------------------------ |
| `auth.js`          | `protect` (xác thực JWT) + `requireAdmin` (check role)                         |
| `generateToken.js` | Tạo JWT với payload `{ id: userId }`                                           |
| `validators.js`    | express-validator rules cho register, login, post, comment, profile, password  |
| `errorHandler.js`  | Global error handler — map `CastError`, `ValidationError`, `11000`, JWT errors |
| `upload.js`        | Multer cho avatar (2MB, jpg/png/webp/gif)                                      |
| `uploadCover.js`   | Multer cho cover (5MB, jpg/png/webp/gif)                                       |

---

## Xử lý lỗi

Mọi lỗi trả về format thống nhất:

```json
{ "success": false, "message": "Mô tả lỗi" }
```

| Status | Ý nghĩa                                                   |
| ------ | --------------------------------------------------------- |
| `400`  | Validation fail / dữ liệu không hợp lệ                    |
| `401`  | Không có token / token hết hạn                            |
| `403`  | Không có quyền (không phải chủ sở hữu / không phải admin) |
| `404`  | Resource không tồn tại                                    |
| `413`  | File upload quá lớn                                       |

Lỗi đặc biệt tự động map trong `errorHandler.js`:

- `CastError` → 400 (ObjectId không hợp lệ)
- `ValidationError` → 400
- Code `11000` → 400 (duplicate unique field)
- `JsonWebTokenError` / `TokenExpiredError` → 401

---

## Upload file

### Avatar (`POST /api/auth/avatar`)

- **Field name**: `avatar`
- **Storage**: `uploads/avatars/`
- **Filename**: `{userId}-{timestamp}.{ext}`
- **Giới hạn**: **2 MB**
- **MIME**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### Cover image (`POST /api/posts/:id/cover`)

- **Field name**: `cover`
- **Storage**: `uploads/covers/`
- **Filename**: `post-{timestamp}-{random}.{ext}`
- **Giới hạn**: **5 MB**
- **MIME**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### Truy cập

Server serve static folder qua:

```js
app.use("/uploads", express.static("uploads"));
```

File URL đầy đủ:

```
http://localhost:5000/uploads/avatars/665abc-1717623456789.jpg
http://localhost:5000/uploads/covers/post-1717623456789-123456789.jpg
```

> Khi xóa bài viết / đổi avatar, file cũ trong `uploads/` được **tự động dọn** nếu nằm trong `uploads/`.

---

## Sanitize HTML

`postController.js` dùng `sanitize-html` strip content từ TipTap trước khi lưu vào DB.

**Tag được phép:**

```
p, br, strong, em, u, s, code, pre,
h2, h3, ul, ol, li, blockquote, hr, a
```

**Attribute được phép:**

- `a[href|target|rel]` — auto thêm `target="_blank" rel="noopener noreferrer"`
- `href` scheme: `http`, `https`, `mailto` (chặn `javascript:`)

**Comment content** cũng strip HTML (giữ plain text) trong `commentController.js`.

---

## Socket.io

Khởi tạo trong `src/socket.js`, mount trong `server.js`.

### Events emit từ server

| Event              | Payload                      | Khi nào                                                           |
| ------------------ | ---------------------------- | ----------------------------------------------------------------- |
| `community:update` | `{ users, posts, comments }` | Sau khi đăng ký / tạo bài / xóa bài / thêm/xóa comment / xóa user |

### Helper `emitCommunityStats()`

Dùng `Promise.all` chạy 3 query song song, gom logic emit ở **1 chỗ** duy nhất (`utils/communityStats.js`).

### Client side (frontend)

```js
import { io } from "socket.io-client";
const socket = io("http://localhost:5000");
socket.on("community:update", (data) => {
  console.log("Stats:", data);
});
```

---

## Auto-seed admin

`utils/seedAdmin.js` chạy tự động mỗi lần server start (gọi trong `server.js`).

**Logic:**

1. Kiểm tra email từ `ADMIN_EMAIL` (mặc định `admin@blogviet.vn`)
2. Nếu **chưa có** → tạo mới với role = `admin`
3. Nếu **đã có** nhưng role ≠ `admin` → promote lên admin
4. Nếu **đã có** rồi → skip

**Log khi tạo:**

```
[seed] Default admin created — email: admin@blogviet.vn | password: admin123
```

> ⚠️ **Đổi `ADMIN_PASSWORD` trong production** hoặc đăng nhập admin rồi đổi mật khẩu.

---

## Scripts

```bash
npm run dev # Dev mode với nodemon
npm start # Production
```

---

## Postman collection

Import file `BlogViet-API.postman_collection.json` vào Postman:

- **6 folders**: Auth, Posts, Comments, Community, Admin
- **17 requests** với token auto-save
- **Schema v2.1.0**
- **Collection variables**: `token`, `postId`, `commentId` tự động cập nhật từ response

**Cách dùng:**

1. Import file vào Postman
2. Chạy `POST /auth/login` (hoặc `register`) trước
3. Token tự động lưu vào collection variable
4. Các request sau dùng `{{token}}` tự động
