# BlogViet

> Nền tảng blog full-stack xây dựng bằng **MERN stack** (MongoDB + Express + React + Node.js) với xác thực JWT, realtime qua Socket.io và giao diện responsive Tailwind CSS.

Dự án hỗ trợ đầy đủ tính năng: CRUD bài viết, bình luận, thả tim, phân trang, tìm kiếm, upload avatar & ảnh bìa, chỉnh sửa hồ sơ cá nhân

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
- [Tác giả](#tác-giả)

---

## Tính năng

### Người dùng

- 📝 **Đăng ký / Đăng nhập** với JWT (bcrypt hash)
- 👤 **Trang cá nhân** với avatar, bio, ngày tham gia
- ✏️ **Chỉnh sửa hồ sơ**: đổi username, bio, mật khẩu, **upload avatar**
- 🖼️ **Upload ảnh đại diện** (preview trước khi lưu, validate type/size)

### Bài viết

- 📰 **CRUD bài viết** (tạo, xem, sửa, xóa)
- 🖼️ **Upload ảnh bìa** cho bài viết
- ❤️ **Like / Unlike** bài viết
- 💬 **Bình luận** (xóa nếu là tác giả comment hoặc chủ bài)
- 🔍 **Tìm kiếm** theo tiêu đề
- 🏷️ **Lọc theo danh mục**, phân trang
- 🏷️ **Tags** cho bài viết

### Realtime & UX

- 📊 **Cập nhật số liệu cộng đồng** realtime qua Socket.io
- 🎨 **Modal composer** tạo bài (kiểu Facebook)
- ✨ Animation chuyển trang mượt mà
- 📱 **Responsive** trên mọi thiết bị

---

## Tech stack

### Backend
| Thành phần | Công nghệ |
|------------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express 5 |
| Database | MongoDB 6+ (Mongoose 9) |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Upload | Multer |
| Realtime | Socket.io 4 |

### Frontend
| Thành phần | Công nghệ |
|------------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Routing | React Router DOM 6 |
| State | Zustand 4 (persist) |
| HTTP | Axios 1.6 |
| Form | React Hook Form 7 + Zod 3 |
| Styling | Tailwind CSS 3 |
| Icons | Lucide React |
| Notification | React Hot Toast |

---

## Kiến trúc

```
┌────────────────────┐ HTTP/REST ┌────────────────────┐
│ React (Vite) :5173 │ ◄──────► │ Express :5000 │
│ - React Router │ │ - REST API │
│ - Zustand store │ │ - JWT auth │
│ - Axios client │ │ - Multer upload │
│ └──── Socket.io ◄──────────────► Socket.io │
└────────────────────┘ └─────────┬─────────┘
│ │
│ Mongoose │
│ │
┌────▼────────────────────┐
│ MongoDB :27017 │
│ - users │
│ - posts │
│ - comments │
└───────────────────────┘
```

- **Frontend** gọi REST API qua Axios (kèm JWT trong header `Authorization`)
- **Static files** (avatar, cover) serve qua `/uploads/...`
- **Realtime**: Server emit `community:update` sau mỗi hành động tạo user/post/comment

---

## Yêu cầu môi trường

Trước khi bắt đầu, đảm bảo máy bạn đã cài:

| Phần mềm | Phiên bản | Kiểm tra |
|----------|-----------|----------|
| **Node.js** | >= 18 | `node -v` |
| **npm** | >= 9 (đi kèm Node) | `npm -v` |
| **MongoDB** | >= 6 (local) hoặc tài khoản Atlas | `mongosh` hoặc xem trên cloud |
| **Git** | mới nhất | `git --version` |

> **MongoDB Atlas (miễn phí)**: Nếu không muốn cài MongoDB local, đăng ký tài khoản tại [mongodb.com/atlas](https://www.mongodb.com/atlas), tạo cluster free và lấy connection string.

---

## Hướng dẫn cài đặt

### Bước 1 — Clone repository

```bash
git clone <repository-url>
cd web
```

### Bước 2 — Cài dependencies cho cả backend và frontend

```bash
# Backend
cd backend
npm install

# Frontend (mở terminal mới hoặc quay lại root)
cd ../frontend
npm install
```

> Hoặc cài song song bằng 2 terminal riêng để tiết kiệm thời gian.

### Bước 3 — Cấu hình biến môi trường

#### Backend — tạo file `backend/.env`

```bash
cd backend
# Tạo file .env (chưa có file mẫu .env.example, tự tạo)
```

Nội dung:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/web_db
JWT_SECRET=your_secret_key_change_me_in_production
NODE_ENV=development
```

> 💡 **Generate JWT_SECRET mạnh** (cho production):
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

Nếu dùng **MongoDB Atlas**, thay `MONGO_URI`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/web_db?retryWrites=true&w=majority
```

#### Frontend — tạo file `frontend/.env`

```bash
cd frontend
cp .env.example .env
```

Mặc định:

```env
VITE_API_URL=http://localhost:5000/api
```

> Sửa nếu backend chạy ở host/port khác.

---

## Chạy dự án

Bạn cần **2 terminal** chạy song song: 1 cho backend, 1 cho frontend.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Server sẽ chạy ở **http://localhost:5000**.

Output mong đợi:

```
◇ injected env (4) from .env
Server running on port 5000
MongoDB connected: localhost
```

> Nếu lỗi `EADDRINUSE` → port 5000 đang bị chiếm. Đổi `PORT` trong `.env` hoặc tắt process cũ.

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

App sẽ chạy ở **http://localhost:5173**.

Mở trình duyệt, truy cập [http://localhost:5173](http://localhost:5173) — bạn sẽ thấy trang chủ BlogViet. 🎉

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
# Output: dist/ — có thể serve qua Nginx, Vercel, Netlify...

# Backend
cd ../backend
npm start
```

---

## Tài khoản demo

Sau khi hệ thống chạy, bạn có thể tự tạo tài khoản qua form đăng ký. Hoặc nếu muốn test nhanh, dùng bất kỳ email/password nào ≥ 6 ký tự.

---

## Cấu trúc thư mục

```
web/
├── README.md # File này
├── .gitignore
├── package.json # Root package.json (monorepo metadata)
│
├── backend/ # Node.js + Express API
│ ├── README.md # Chi tiết API, models, env...
│ ├── .env # Biến môi trường (KHÔNG commit)
│ ├── package.json
│ ├── uploads/ # Thư mục chứa file upload
│ └── src/
│ ├── server.js
│ ├── socket.js
│ ├── config/ db.js
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ └── routes/
│
└── frontend/ # React + Vite SPA
 ├── README.md # Chi tiết components, routes, design system
 ├── .env # Biến môi trường (KHÔNG commit)
 ├── package.json
 ├── index.html
 ├── vite.config.js
 ├── tailwind.config.js
 └── src/
 ├── main.jsx
 ├── App.jsx
 ├── components/
 │ ├── common/
 │ ├── posts/
 │ └── comments/
 ├── pages/
 ├── hooks/
 ├── services/
 ├── stores/
 └── utils/
```

Xem chi tiết từng phần:
- [Backend README](backend/README.md) — API endpoints, models, error handling
- [Frontend README](frontend/README.md) — Components, routing, state management

---

## Tài liệu liên quan

- [Backend API documentation](backend/README.md)
- [Frontend documentation](frontend/README.md)
- [Express.js docs](https://expressjs.com/)
- [React docs](https://react.dev/)
- [MongoDB docs](https://www.mongodb.com/docs/)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [Socket.io](https://socket.io/docs/)
