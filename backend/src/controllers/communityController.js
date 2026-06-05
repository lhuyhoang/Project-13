const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const getCounts = async (req, res, next) => {
  try {
    const users = await User.countDocuments();
    const posts = await Post.countDocuments();
    const comments = await Comment.countDocuments();
    res.json({ success: true, users, posts, comments });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCounts };
