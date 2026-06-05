const Post = require("../models/Post");
const sanitizeHtml = require("sanitize-html");

const sanitizeContent = (html) =>
  sanitizeHtml(html || "", {
    allowedTags: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "s",
      "code",
      "pre",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "blockquote",
      "hr",
      "a",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        rel: "noopener noreferrer",
        target: "_blank",
      }),
    },
  });

const getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { author: req.user._id };
    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content");

    res.json({
      success: true,
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    if (req.query.search) {
      filter.title = { $regex: req.query.search, $options: "i" };
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .populate("author", "username avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-content");

    res.json({
      success: true,
      posts,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username avatar",
    );
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại" });
    }
    res.json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, content, summary, category, coverImage, tags } = req.body;
    const post = await Post.create({
      title,
      content: sanitizeContent(content),
      summary,
      category,
      coverImage,
      tags,
      author: req.user._id,
    });

    await post.populate("author", "username avatar");

    emitCommunityStats();

    res.status(201).json({ success: true, post });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền chỉnh sửa bài viết này",
      });
    }

    const { title, content, summary, category, coverImage, tags } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content: content !== undefined ? sanitizeContent(content) : undefined,
        summary,
        category,
        coverImage,
        tags,
      },
      { new: true, runValidators: true },
    ).populate("author", "username avatar");

    res.json({ success: true, post: updatedPost });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa bài viết này",
      });
    }

    await post.deleteOne();

    emitCommunityStats();

    res.json({ success: true, message: "Bài viết đã được xóa" });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại" });
    }

    const userId = req.user._id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({
      success: true,
      liked: !isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

const uploadCoverImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng chọn một file ảnh" });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Bài viết không tồn tại" });
    }
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền sửa bài viết này",
      });
    }

    // Xóa ảnh bìa cũ nếu có (local upload)
    if (post.coverImage && post.coverImage.startsWith("/uploads/")) {
      const oldPath = path.join(__dirname, "../../", post.coverImage);
      if (fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {}
      }
    }

    const coverUrl = `/uploads/covers/${req.file.filename}`;
    post.coverImage = coverUrl;
    await post.save();

    res.json({ success: true, coverImage: coverUrl, post });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  uploadCoverImage,
};
