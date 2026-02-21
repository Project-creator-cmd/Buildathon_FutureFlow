const mongoose = require('mongoose');

const degreeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['undergraduate', 'postgraduate', 'diploma', 'certification'] },
  duration: { type: String },
  streams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stream' }],
  requiredExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Degree', degreeSchema);
