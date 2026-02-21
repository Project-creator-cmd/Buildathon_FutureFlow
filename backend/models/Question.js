const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply' }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Question', questionSchema);
