const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, '../../uploads/avatars');
if (!fs.existsSync(uploadDir)) {
 fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
 destination: (req, file, cb) => cb(null, uploadDir),
 filename: (req, file, cb) => {
 // Đặt tên theo userId + timestamp để tránh trùng và dễ dọn dẹp
 const ext = path.extname(file.originalname).toLowerCase();
 cb(null, `${req.user._id}-${Date.now()}${ext}`);
 },
});

const fileFilter = (req, file, cb) => {
 const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
 if (allowed.includes(file.mimetype)) cb(null, true);
 else cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, webp, gif)'), false);
};

const upload = multer({
 storage,
 fileFilter,
 limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

module.exports = upload;