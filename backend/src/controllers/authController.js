const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const generateToken = require("../middleware/generateToken");
const { getIO } = require("../socket");

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

    // emit updated community stats
    try {
      const users = await User.countDocuments();
      const posts = await Post.countDocuments();
      const comments = await Comment.countDocuments();
      getIO().emit("community:update", { users, posts, comments });
    } catch (e) {
      // ignore
    }

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
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
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
      },
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
  const { username, bio } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { username, bio }, { new: true, runValidators: true });
  res.json({ success: true, user });
};
const changePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  const isMath = await user.comparePassword(currentPassword);
  if (!isMatch) return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Đổi mật khẩu thành công' });
};

const updateAvatar = async (req, res, next) => {
  // req.file được multer xử lý
  const avatarUrl = req.file.path; // Cloudinary URL hoặc local path
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: avatarUrl },
    { new: true }
  );
  res.json({ success: true, user });
};

module.exports = {
  register,
  login,
  getMe,
};
