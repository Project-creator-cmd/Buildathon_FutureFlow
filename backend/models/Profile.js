const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tenthMarks: { type: Number, required: true },
  currentLevel: { 
    type: String, 
    enum: ['10th', 'intermediate', 'diploma', 'degree', 'postgraduate'],
    required: true 
  },
  strengths: [{ type: String }],
  interests: [{ type: String }],
  bookmarkedCareers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Career' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
