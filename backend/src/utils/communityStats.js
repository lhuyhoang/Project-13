const { getIO } = require("../socket");
const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const emitCommunityStats = async () => {
  try {
    const [users, posts, comments] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
    ]);
    getIO().emit("community:update", { users, posts, comments });
  } catch (e) {
    // Realtime là tính năng phụ — nuốt lỗi để không chặn flow chính
  }
};

module.exports = { emitCommunityStats };
