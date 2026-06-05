const errorHandler = (err, req, res, next) => {
 let statusCode = err.statusCode || 500;
 let message = err.message || "Lỗi máy chủ";

 // Log full error to server console for debugging
 console.error("[errorHandler]", req.method, req.originalUrl);
 console.error(" name:", err.name, "statusCode:", statusCode);
 console.error(" message:", err.message);
 if (err.stack) console.error(" stack:", err.stack.split("\n").slice(0, 6).join("\n"));

 if (err.name === "CastError") {
 statusCode = 404;
 message = `Tài nguyên với id ${err.value} không tồn tại`;
 }
 if (err.code === 11000) {
 statusCode = 400;
 const field = Object.keys(err.keyValue)[0];
 message = `${field} already exists`;
 }
 if (err.name === "ValidationError") {
 statusCode = 400;
 message = Object.values(err.errors)
 .map((e) => e.message)
 .join(", ");
 }
 if (err.name === "JsonWebTokenError") {
 statusCode = 401;
 message = "Token không hợp lệ";
 }
 if (err.name === "TokenExpiredError") {
 statusCode = 401;
 message = "Token đã hết hạn, vui lòng đăng nhập lại";
 }

 res.status(statusCode).json({
 success: false,
 message,
 ...(err.stack && process.env.NODE_ENV === "development"
 ? { stack: err.stack }
 : {}),
 });
};

module.exports = errorHandler;
