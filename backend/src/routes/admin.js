const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
 getStats,
 getAllUsers,
 updateUserRole,
 deleteUser,
 getAllPosts,
 adminDeletePost,
 getAllComments,
 adminDeleteComment,
} = require("../controllers/adminController");

router.use(protect, requireAdmin);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/posts", getAllPosts);
router.delete("/posts/:id", adminDeletePost);
router.get("/comments", getAllComments);
router.delete("/comments/:id", adminDeleteComment);

module.exports = router;
