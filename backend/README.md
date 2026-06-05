# BlogViet — Backend API

RESTful API cho nền tảng blog, xây dựng bằng **Node.js + Express + MongoDB**.

---

## Mục lục

- [Tech stack](#tech-stack)
- [Cấu trúc thư mục](#cấu-truc-thu-muc)
- [Cài đặt & Chạy](#cài-đặt--chạy)
- [Biến môi trường](#biến-môi-trường)
- [API Endpoints](#api-endpoints)
- [Models (Schemas)](#models-schemas)
- [Xử lý lỗi](#xử-lý-lỗi)
- [Upload file](#upload-file)
- [Socket.io](#socketio)
- [Tác giả](#tác-giả)

---

## Tech stack

| Thành phần | Công nghệ |
|------------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Database | MongoDB 6+ |
| ODM | Mongoose 9 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Upload | Multer (diskStorage) |
| Realtime | Socket.io 4 |
| Dev tool | Nodemon |

---

## Cấu trúc thư mục

```
backend/
├── .env.example # Mẫu biến môi trường
├── .gitignore
├── package.json
├── uploads/ # Thư mục chứa file upload (tự tạo lúc chạy)
│ ├── avatars/ # Avatar user
│ └── covers/ # Ảnh bìa bài viết
└── src/
 ├── server.js # Entry point — khởi tạo Express + Socket.io
 ├── socket.js # Cấu hình Socket.io (init, getIO)
 ├── config/
 │ └── db.js # Kết nối MongoDB
 ├── controllers/ # Xử lý logic cho từng resource
 │ ├── authController.js
 │ ├── postController.js
 │ ├── commentController.js
 │ └── communityController.js
 ├── middleware/
 │ ├── auth.js # protect — xác thực JWT
 │ ├── generateToken.js # Tạo JWT
 │ ├── validators.js # express-validator rules
 │ ├── errorHandler.js # Global error handler
 │ ├── upload.js # Multer cho avatar (2MB)
 │ └── uploadCover.js # Multer cho cover image (5MB)
 ├── models/ # Mongoose schemas
 │ ├── User.js
 │ ├── Post.js
 │ └── Comment.js
 └── routes/ # Express routers
 ├── auth.js
 ├── posts.js
 ├── comments.js
 └── community.js
```

---

## Cài đặt & Chạy

### Yêu cầu

- **Node.js** >= 18
- **MongoDB** >= 6 (local hoặc MongoDB Atlas)
- **npm** hoặc **yarn**

### Bước 1 — Cài dependencies

```bash
cd backend
npm install
```

### Bước 2 — Tạo file `.env`

```bash
cp .env.example .env # nếu có file mẫu
# hoặc tự tạo file .env với nội dung:
```

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/web_db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

> **Lưu ý:** Đổi `JWT_SECRET` thành chuỗi random dài trong production. Có thể generate bằng:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### Bước 3 — Chạy server

```bash
# Dev mode (auto-reload với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy ở `http://localhost:5000` (hoặc port trong `.env`).

### Kiểm tra nhanh

```bash
curl http://localhost:5000/api/health
# → { "status": "OK" }
```

---

## Biến môi trường

| Biến | Bắt buộc | Mặc định | Mô tả |
|------|----------|----------|-------|
| `PORT` | Không | `5000` | Cổng server lắng nghe |
| `MONGO_URI` | **Có** | — | Connection string MongoDB |
| `JWT_SECRET` | **Có** | — | Secret key ký JWT (đổi trong production) |
| `NODE_ENV` | Không | `development` | Môi trường (`development` / `production`) |
| `CLIENT_URL` | Không | `http://localhost:5173` | CORS origin cho frontend |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

> 🔒 = cần `Authorization: Bearer <token>` header

### Authentication

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới | |
| `POST` | `/auth/login` | Đăng nhập, trả về JWT | |
| `GET` | `/auth/me` | Lấy thông tin user hiện tại | 🔒 |
| `PUT` | `/auth/profile` | Cập nhật username và/hoặc bio | 🔒 |
| `PUT` | `/auth/password` | Đổi mật khẩu | 🔒 |
| `POST` | `/auth/avatar` | Upload avatar (multipart, field: `avatar`) | 🔒 |

#### Request ví dụ

**Register**
```json
POST /api/auth/register
{
 "username": "testuser",
 "email": "test@example.com",
 "password": "123456"
}
```

**Login response**
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
 "createdAt": "2026-06-05T10:00:00.000Z"
 }
}
```

### Posts

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/posts` | Danh sách bài viết (phân trang, search, filter) | |
| `GET` | `/posts/:id` | Chi tiết 1 bài viết | |
| `POST` | `/posts` | Tạo bài viết mới | 🔒 |
| `PUT` | `/posts/:id` | Sửa bài viết (chỉ chủ sở hữu) | 🔒 |
| `DELETE` | `/posts/:id` | Xóa bài viết (chỉ chủ sở hữu) | 🔒 |
| `POST` | `/posts/:id/like` | Toggle like / unlike | 🔒 |
| `POST` | `/posts/:id/cover` | Upload ảnh bìa (multipart, field: `cover`) | 🔒 |

**Query params cho `GET /posts`:**
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

### Comments

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/posts/:postId/comments` | Lấy comments của 1 bài viết | |
| `POST` | `/posts/:postId/comments` | Thêm comment | 🔒 |
| `DELETE` | `/comments/:id` | Xóa comment (tác giả comment hoặc chủ bài) | 🔒 |

### Community Stats

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/community` | Đếm tổng số user, post, comment |

### Health Check

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/health` | Kiểm tra server còn sống |

---

## Models (Schemas)

### User

```js
{
 username: String // unique, 3-30 ký tự
 email: String // unique, format email
 password: String // hashed, min 6, select: false
 avatar: String // URL (local: "/uploads/avatars/xxx")
 bio: String // max 200
 createdAt, updatedAt: Date // tự động (timestamps)
}
```

**Methods:**
- `comparePassword(candidatePassword)` — so sánh với hash

**Hooks:**
- `pre('save')` — tự hash password khi tạo/sửa

### Post

```js
{
 title: String // required, 5-150 ký tự
 content: String // required, min 20
 summary: String // optional, max 300
 category: String // enum: 'Công nghệ' | 'Lập trình' | ...
 coverImage: String // URL
 author: ObjectId // ref: User
 likes: [ObjectId] // mảng ref: User
 tags: [String] // lowercase
 createdAt, updatedAt: Date
}
```

**Virtuals:**
- `likeCount` — `likes.length` (xuất hiện trong JSON response)

**Indexes:**
- `title` (text) + `category`
- `category`
- `author`
- `tags`
- `createdAt` (desc)

### Comment

```js
{
 content: String // required, 1-500
 author: ObjectId // ref: User
 post: ObjectId // ref: Post
 createdAt, updatedAt: Date
}
```

---

## Xử lý lỗi

Mọi lỗi được trả về với format thống nhất:

```json
{
 "success": false,
 "message": "Mô tả lỗi"
}
```

Mã lỗi thường gặp:

| Status | Ý nghĩa |
|--------|----------|
| `400` | Validation fail / dữ liệu không hợp lệ |
| `401` | Không có token / token hết hạn / không hợp lệ |
| `403` | Không có quyền (không phải chủ sở hữu) |
| `404` | Resource không tồn tại |
| `413` | File upload quá lớn (Multer `LIMIT_FILE_SIZE`) |
| `429` | Rate limit (chưa implement, dự kiến thêm) |
| `500` | Lỗi server nội bộ |

Các lỗi đặc biệt được map tự động trong `middleware/errorHandler.js`:
- `CastError` → 400 (ObjectId không hợp lệ)
- `ValidationError` → 400 (Mongoose validation fail)
- Code `11000` → 400 (duplicate unique field)
- `JsonWebTokenError` / `TokenExpiredError` → 401

---

## Upload file

### Avatar (`POST /api/auth/avatar`)

- **Field name**: `avatar`
- **Storage**: `uploads/avatars/`
- **Filename**: `{userId}-{timestamp}.{ext}`
- **Giới hạn**: 2 MB
- **MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### Cover image (`POST /api/posts/:id/cover`)

- **Field name**: `cover`
- **Storage**: `uploads/covers/`
- **Filename**: `post-{timestamp}-{random}.{ext}`
- **Giới hạn**: 5 MB
- **MIME types**: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

### Truy cập file

Server serve static folder `uploads/` qua:

```js
app.use('/uploads', express.static('uploads'))
```

File URL đầy đủ:
```
http://localhost:5000/uploads/avatars/665abc-1717623456789.jpg
http://localhost:5000/uploads/covers/post-1717623456789-123456789.jpg
```

> Khi xóa bài viết hoặc đổi avatar, file cũ trên disk sẽ **tự động được dọn** nếu nằm trong `uploads/`.

---

## Socket.io

Server khởi tạo Socket.io ngay khi start (`src/socket.js`).

### Events emit từ server

| Event | Payload | Khi nào |
|-------|---------|---------|
| `community:update` | `{ users, posts, comments }` | Sau khi đăng ký / tạo bài / thêm comment |

### Client side (frontend)

```js
import { io } from 'socket.io-client'
const socket = io('http://localhost:5000')
socket.on('community:update', (data) => {
 console.log('Stats updated:', data)
})
```

---

## Scripts

```bash
npm run dev # Chạy với nodemon (auto-reload)
npm start # Chạy production
```
