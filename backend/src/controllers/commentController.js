const Comment = require('../models/Comment');
const Post = require('../models/Post');

const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'username avatar')
            .sort({ createdAt: -1 });
        
        res.json({ success: true, comments });
    } catch (error) {
        next(error);
    }
};

const addComment = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
        }

        const comment = await Comment.create({
            content: req.body.content,
            author: req.user._id,
            post: req.params.postId,
        });
        
        await comment.populate('author', 'username avatar');
        res.status(201).json({ success: true, comment });
    } catch (error) {
        next(error);
    }
};

const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('post', 'author');
        if (!comment) {
            return res.status(404),json({ success: false, message: 'Bình luận không tồn tại' });
        }

        const isCommentAuthor = comment.author.toString() === req.user._id.toString() === req.user._id.toString();
        const isPostAuthor = commnet.post.author.toString() === req.user._id.toString();

        if (!isCommentAuthor && !isPostAuthor) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xóa bình luận này',
            });
        }

        await comment.deleteOne();
        res.json({ success: true, message: 'Bình luận đã được xóa' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment,
};