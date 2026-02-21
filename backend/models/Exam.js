const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String },
  streams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stream' }],
  level: { type: String, enum: ['entrance', 'competitive', 'certification'] },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Exam', examSchema);
