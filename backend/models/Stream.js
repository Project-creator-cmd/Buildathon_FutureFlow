const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  after10th: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Stream', streamSchema);
