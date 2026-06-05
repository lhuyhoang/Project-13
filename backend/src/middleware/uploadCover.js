const multer = require("multer");

const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
 if (ALLOWED_MIMES.includes(file.mimetype)) cb(null, true);
 else cb(new Error("Chỉ chấp nhận file ảnh (jpg, png, webp, gif)"), false);
};

// memoryStorage: giữ file trong RAM (req.file.buffer) — sẽ upload lên Cloudinary
const upload = multer({
 storage: multer.memoryStorage(),
 fileFilter,
 limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cho cover
});

module.exports = upload;
