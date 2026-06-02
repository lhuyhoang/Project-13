const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
} = require('../controllers/postController');
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');
const { postValidator, commentValidator } = require('../middleware/validators');

router.get('/', getPosts);                                   
router.get('/:id', getPostById);                            
router.post('/', protect, postValidator, createPost);        
router.put('/:id', protect, postValidator, updatePost);      
router.delete('/:id', protect, deletePost);                 
router.post('/:id/like', protect, toggleLike);     

router.get('/:postId/comments', getComments);
router.post('/:postId/comments', protect, commentValidator, addComment);

module.exports = router;