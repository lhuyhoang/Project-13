const express = require("express");
const router = express.Router();
const {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  uploadCoverImage,
} = require("../controllers/postController");
const { getComments, addComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");
const { postValidator, commentValidator } = require("../middleware/validators");
const uploadCover = require("../middleware/uploadCover");

router.get("/", getPosts);
router.get("/me/posts", protect, getMyPosts);
router.get("/:id", getPostById);
router.post("/", protect, postValidator, createPost);
router.put("/:id", protect, postValidator, updatePost);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.post(
  "/:id/cover",
  protect,
  uploadCover.single("cover"),
  uploadCoverImage,
);

router.get("/:postId/comments", getComments);
router.post("/:postId/comments", protect, commentValidator, addComment);

module.exports = router;
