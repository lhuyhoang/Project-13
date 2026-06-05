const { body, validationResult } = require("express-validator");

// Xử lý kết quả validation
const validate = (req, res, next) => {
 const errors = validationResult(req);
 if (!errors.isEmpty()) {
 return res.status(400).json({
 success: false,
 message: errors
 .array()
 .map((e) => `${e.path}: ${e.msg}`)
 .join("; "),
 });
 }
 next();
};

// Trình xác thực
const registerValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username không được để trống")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username phải có từ 3 đến 30 ký tự"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password")
    .notEmpty()
    .withMessage("Password không được để trống")
    .isLength({ min: 6 })
    .withMessage("Password phải có ít nhất 6 ký tự"),
  validate,
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Password không được để trống"),
  validate,
];

// Validation cho bài viết
const postValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Tiêu đề không được để trống")
    .isLength({ min: 5, max: 150 })
    .withMessage("Tiêu đề phải có từ 5 đến 150 ký tự"),
 body("content")
 .notEmpty()
 .withMessage("Nội dung không được để trống")
 .custom((value) => {
 const plain = String(value || "").replace(/<[^>]+>/g, "").trim();
 if (plain.length < 20) {
 throw new Error("Nội dung phải có ít nhất 20 ký tự (không tính thẻ HTML)");
 }
 return true;
 }),
  body("category")
    .notEmpty()
    .withMessage("Danh mục không được để trống")
    .isIn([
      "Công nghệ",
      "Giải trí",
      "Thể thao",
      "Kinh doanh",
      "Sức khỏe",
      "Khác",
    ])
    .withMessage("Danh mục không hợp lệ"),
  validate,
];

// Validation cho comment
const commentValidation = [
  body("content")
    .notEmpty()
    .withMessage("Nội dung bình luận không được để trống")
    .isLength({ min: 1, max: 500 })
    .withMessage("Nội dung bình luận phải có từ 1 đến 500 ký tự"),
  validate,
];

const updateProfileValidation = [
  body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username phải có từ 3 đến 30 ký tự"),
  body("email")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Email phải có tối đa 200 ký tự"),
  validate,
];

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Mật khẩu hiện tại không được để trống"),
  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới phải có ít nhất 6 ký tự")
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage("Mật khẩu mới phải khác mật khẩu hiện tại"),
  validate,
];

module.exports = {
  registerValidator: registerValidation,
  loginValidator: loginValidation,
  postValidator: postValidation,
  commentValidator: commentValidation,
  updateProfileValidator: updateProfileValidation,
  changePasswordValidator: changePasswordValidation,
};
