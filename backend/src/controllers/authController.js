const User = require("../models/User");
const generateToken = require("../middleware/generateToken");
const { emitCommunityStats } = require("../utils/communityStats");
const path = require("path");

const formatUser = (user) => ({
 _id: user._id,
 username: user.username,
 email: user.email,
 avatar: user.avatar,
 bio: user.bio,
 role: user.role,
 createdAt: user.createdAt,
});

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email đã được sử dụng",
      });
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    emitCommunityStats();

    res.status(201).json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc mật khẩu không đúng",
      });
    }
    // verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Email hoặc mật khẩu không đúng" });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: formatUser(user),
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, bio } = req.body;

    if (username === undefined && bio === undefined) {
      return res.status(400).json({
        success: false,
        message: "Không có dữ liệu cập nhật",
      });
    }

    if (username !== undefined) {
      const existing = await User.findOne({
        username,
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Username đã được sử dụng",
        });
      }
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username, bio },
      { new: true },
    );
    res.json({ success: true, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Mật khẩu hiện tại không chính xác" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
 try {
 if (!req.file) {
 return res
 .status(400)
        .json({ success: false, message: "Vui lòng chọn một file ảnh" });
    }

    const oldUser = await User.findById(req.user._id);
    if (oldUser.avatar && oldUser.avatar.startsWith("/uploads/")) {
      const fs = require("fs");
      const oldPath = path.join(__dirname, "../../", oldUser.avatar);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          /* ignore */
        }
      }
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: avatarUrl },
      { new: true },
    );
    res.json({ success: true, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  updateAvatar,
};
