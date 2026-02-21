const express = require('express');
const router = express.Router();
const { 
  getAllPosts, 
  createPost, 
  replyToPost, 
  likePost,
  likeReply
} = require('../controllers/forumController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllPosts);
router.post('/', protect, createPost);
router.post('/:id/reply', protect, replyToPost);
router.post('/:id/like', protect, likePost);
router.post('/:postId/reply/:replyId/like', protect, likeReply);

module.exports = router;
