require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const communityRoutes = require("./routes/community");
const adminRoutes = require("./routes/admin");

const app = express();

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

connectDB();
require("./utils/seedAdmin")();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => res.json({ status: "OK" }));

app.use((err, req, res, next) => {
 if (err instanceof multer.MulterError) {
 return res.status(400).json({
 success: false,
 message:
 err.code === "LIMIT_FILE_SIZE"
 ? "File quá lớn. Kích thước tối đa là 2MB."
 : `Lỗi upload: ${err.message}`,
 });
 }
 // Cho các error khác đi tiếp tới errorHandler cuối
 next(err);
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const http = require("http");
const server = http.createServer(app);

// initialize socket.io
const { init } = require("./socket");
init(server);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
