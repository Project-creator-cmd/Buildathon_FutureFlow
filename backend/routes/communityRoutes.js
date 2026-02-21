const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  addReply,
  likeReply,
  deleteReply
} = require('../controllers/communityController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Question routes
router.get('/questions', getAllQuestions);
router.post('/questions', createQuestion);
router.get('/questions/:id', getQuestionById);

// Reply routes
router.post('/questions/:id/reply', addReply);
router.post('/replies/:replyId/like', likeReply);
router.delete('/replies/:replyId', deleteReply);

module.exports = router;
