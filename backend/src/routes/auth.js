const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  updateAvatar,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  changePasswordValidator,
} = require("../middleware/validators");
const upload = require("../middleware/upload");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfileValidator, updateProfile);
router.put("/password", protect, changePasswordValidator, changePassword);
router.post("/avatar", protect, upload.single("avatar"), updateAvatar);

module.exports = router;
