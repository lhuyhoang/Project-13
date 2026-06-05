const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { emitCommunityStats } = require("../utils/communityStats");

const getStats = async (req, res, next) => {
 try {
 const [totalUsers, totalPosts, totalComments, adminCount, recentUsers] =
 await Promise.all([
 User.countDocuments(),
 Post.countDocuments(),
 Comment.countDocuments(),
 User.countDocuments({ role: "admin" }),
 User.find()
 .sort({ createdAt: -1 })
 .limit(5)
 .select("username email avatar role createdAt"),
 ]);

 const totalLikesAgg = await Post.aggregate([
 { $project: { likesCount: { $size: { $ifNull: ["$likes", []] } } } },
 { $group: { _id: null, total: { $sum: "$likesCount" } } },
 ]);
 const totalLikes = totalLikesAgg[0]?.total || 0;

 res.json({
 success: true,
 stats: {
 totalUsers,
 totalPosts,
 totalComments,
 totalLikes,
 adminCount,
 recentUsers,
 },
 });
 } catch (error) {
 next(error);
 }
};

const getAllUsers = async (req, res, next) => {
 try {
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 20;
 const search = req.query.search || "";

 const filter = search
 ? {
 $or: [
 { username: { $regex: search, $options: "i" } },
 { email: { $regex: search, $options: "i" } },
 ],
 }
 : {};

 const [users, total] = await Promise.all([
 User.find(filter)
 .sort({ createdAt: -1 })
 .skip((page - 1) * limit)
 .limit(limit)
 .select("-password"),
 User.countDocuments(filter),
 ]);

 res.json({
 success: true,
 users,
 pagination: {
 page,
 limit,
 total,
 totalPages: Math.ceil(total / limit),
 },
 });
 } catch (error) {
 next(error);
 }
};

const updateUserRole = async (req, res, next) => {
 try {
 const { role } = req.body;
 if (!["user", "admin"].includes(role)) {
 return res
 .status(400)
 .json({ success: false, message: "Role không hợp lệ" });
 }

 if (req.params.id === req.user._id.toString() && role !== "admin") {
 return res.status(400).json({
 success: false,
 message: "Không thể tự hạ quyền admin của chính mình",
 });
 }

 const user = await User.findByIdAndUpdate(
 req.params.id,
 { role },
 { new: true },
 ).select("-password");

 if (!user) {
 return res
 .status(404)
 .json({ success: false, message: "Người dùng không tồn tại" });
 }

 res.json({ success: true, user });
 } catch (error) {
 next(error);
 }
};

const deleteUser = async (req, res, next) => {
 try {
 if (req.params.id === req.user._id.toString()) {
 return res.status(400).json({
 success: false,
 message: "Không thể tự xóa tài khoản của chính mình",
 });
 }

 const user = await User.findById(req.params.id);
 if (!user) {
 return res
 .status(404)
 .json({ success: false, message: "Người dùng không tồn tại" });
 }

 await Post.deleteMany({ author: user._id });
 await Comment.deleteMany({ author: user._id });
 await User.findByIdAndDelete(user._id);

 emitCommunityStats();

 res.json({ success: true, message: "Đã xóa người dùng và toàn bộ nội dung liên quan" });
 } catch (error) {
 next(error);
 }
};

const getAllPosts = async (req, res, next) => {
 try {
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 20;
 const search = req.query.search || "";

 const filter = search
 ? { title: { $regex: search, $options: "i" } }
 : {};

 const [posts, total] = await Promise.all([
 Post.find(filter)
 .populate("author", "username avatar")
 .sort({ createdAt: -1 })
 .skip((page - 1) * limit)
 .limit(limit),
 Post.countDocuments(filter),
 ]);

 res.json({
 success: true,
 posts,
 pagination: {
 page,
 limit,
 total,
 totalPages: Math.ceil(total / limit),
 },
 });
 } catch (error) {
 next(error);
 }
};

const adminDeletePost = async (req, res, next) => {
 try {
 const post = await Post.findById(req.params.id);
 if (!post) {
 return res
 .status(404)
 .json({ success: false, message: "Bài viết không tồn tại" });
 }

 await Comment.deleteMany({ post: post._id });
 await Post.findByIdAndDelete(post._id);

 emitCommunityStats();

 res.json({ success: true, message: "Đã xóa bài viết" });
 } catch (error) {
 next(error);
 }
};

const getAllComments = async (req, res, next) => {
 try {
 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 20;
 const search = req.query.search || "";

 const filter = search
 ? { content: { $regex: search, $options: "i" } }
 : {};

 const [comments, total] = await Promise.all([
 Comment.find(filter)
 .populate("author", "username avatar")
 .populate("post", "title")
 .sort({ createdAt: -1 })
 .skip((page - 1) * limit)
 .limit(limit),
 Comment.countDocuments(filter),
 ]);

 res.json({
 success: true,
 comments,
 pagination: {
 page,
 limit,
 total,
 totalPages: Math.ceil(total / limit),
 },
 });
 } catch (error) {
 next(error);
 }
};

 const adminDeleteComment = async (req, res, next) => {
 try {
 const comment = await Comment.findById(req.params.id);
 if (!comment) {
 return res
 .status(404)
 .json({ success: false, message: "Bình luận không tồn tại" });
 }

 await Comment.findByIdAndDelete(comment._id);

 emitCommunityStats();

 res.json({ success: true, message: "Đã xóa bình luận" });
 } catch (error) {
 next(error);
 }
};

module.exports = {
 getStats,
 getAllUsers,
 updateUserRole,
 deleteUser,
 getAllPosts,
 adminDeletePost,
 getAllComments,
 adminDeleteComment,
};
