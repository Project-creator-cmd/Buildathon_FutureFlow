const ForumPost = require('../models/ForumPost');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .populate('user', 'name')
      .populate('replies.user', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, description } = req.body;

    const post = await ForumPost.create({
      user: req.user._id,
      title,
      description
    });

    const populatedPost = await ForumPost.findById(post._id).populate('user', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.replies.push({
      user: req.user._id,
      text
    });

    await post.save();

    const populatedPost = await ForumPost.findById(post._id)
      .populate('user', 'name')
      .populate('replies.user', 'name');

    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: post.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.likeReply = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const reply = post.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    const alreadyLiked = reply.likes.includes(req.user._id);

    if (alreadyLiked) {
      reply.likes = reply.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      reply.likes.push(req.user._id);
    }

    await post.save();

    res.json({ likes: reply.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
