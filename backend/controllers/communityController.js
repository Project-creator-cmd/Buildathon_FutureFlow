const Question = require('../models/Question');
const Reply = require('../models/Reply');

// Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'replies') {
      sortOption = { replies: -1 };
    }

    const questions = await Question.find(query)
      .populate('author', 'name')
      .sort(sortOption)
      .lean();

    // Add reply count to each question
    const questionsWithCount = questions.map(q => ({
      ...q,
      replyCount: q.replies?.length || 0
    }));

    res.json(questionsWithCount);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single question with replies
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name' }
      })
      .lean();

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Increment view count
    await Question.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new question
exports.createQuestion = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const question = await Question.create({
      title,
      description,
      category: category || 'General',
      author: req.user._id
    });

    const populatedQuestion = await Question.findById(question._id)
      .populate('author', 'name');

    res.status(201).json(populatedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add reply to question
exports.addReply = async (req, res) => {
  try {
    const { content } = req.body;
    const questionId = req.params.id;

    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const reply = await Reply.create({
      content,
      author: req.user._id,
      question: questionId
    });

    // Add reply to question
    question.replies.push(reply._id);
    await question.save();

    const populatedReply = await Reply.findById(reply._id)
      .populate('author', 'name');

    res.status(201).json(populatedReply);
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: error.message });
  }
};

// Like a reply
exports.likeReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const alreadyLiked = reply.likes.includes(req.user._id);

    if (alreadyLiked) {
      reply.likes = reply.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      reply.likes.push(req.user._id);
    }

    await reply.save();

    res.json({ likes: reply.likes.length, liked: !alreadyLiked });
  } catch (error) {
    console.error('Error liking reply:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete own reply
exports.deleteReply = async (req, res) => {
  try {
    const reply = await Reply.findById(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user is the author
    if (reply.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    // Remove reply from question
    await Question.findByIdAndUpdate(reply.question, {
      $pull: { replies: reply._id }
    });

    await Reply.findByIdAndDelete(req.params.replyId);

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: error.message });
  }
};
