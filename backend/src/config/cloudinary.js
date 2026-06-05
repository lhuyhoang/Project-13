const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
 cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
 api_key: process.env.CLOUDINARY_API_KEY,
 api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload một Buffer (từ multer memoryStorage) lên Cloudinary
 * @param {Buffer} buffer - file buffer từ req.file.buffer
 * @param {string} folder - thư mục trên Cloudinary, vd: "blogviet/avatars"
 * @param {object} options - tuỳ chọn thêm (transformation, public_id,…)
 * @returns {Promise<object>} kết quả trả về từ Cloudinary, có .secure_url
 */
const uploadToCloudinary = (buffer, folder = "blogviet", options = {}) => {
 return new Promise((resolve, reject) => {
 const uploadStream = cloudinary.uploader.upload_stream(
 {
 folder,
 resource_type: "image",
 ...options,
 },
 (error, result) => {
 if (error) return reject(error);
 resolve(result);
 },
 );
 streamifier.createReadStream(buffer).pipe(uploadStream);
 });
};

/**
 * Xoá file trên Cloudinary qua secure_url
 * Lấy public_id từ URL rồi gọi destroy
 */
const deleteFromCloudinary = async (secureUrl) => {
 if (!secureUrl || !secureUrl.includes("cloudinary.com")) return;
 try {
 // URL dạng: https://res.cloudinary.com/<cloud>/image/upload/v123/folder/filename.ext
 const parts = secureUrl.split("/upload/");
 if (parts.length < 2) return;
 const path = parts[1].replace(/^v\d+\//, ""); // bỏ version nếu có
 const publicId = path.replace(/\.[^.]+$/, ""); // bỏ extension
 await cloudinary.uploader.destroy(publicId);
 } catch (e) {
 // nuốt lỗi — không chặn flow chính
 console.warn("[cloudinary] delete failed:", e.message);
 }
};

module.exports = {
 cloudinary,
 uploadToCloudinary,
 deleteFromCloudinary,
};
