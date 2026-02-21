const mongoose = require('mongoose');

const jobRoleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ['entry', 'mid', 'senior'], required: true },
  salaryRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true }
  },
  experience: { type: String, required: true },
  requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  parentRole: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole' },
  sector: { type: String, enum: ['private', 'government', 'both'], default: 'both' },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobRole', jobRoleSchema);
