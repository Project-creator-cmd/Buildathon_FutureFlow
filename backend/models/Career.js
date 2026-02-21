const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  // New structure matching your requirements
  stream: { type: String },
  root_path: { type: String },
  after_10th: { type: String },
  entrance_exams: [{ type: String }],
  degree_options: [{ type: String }],
  skills_required: [{ type: String }],
  career_options: [{ type: String }],
  alternative_paths: [{ type: String }],
  
  // Legacy fields for backward compatibility
  name: { type: String },
  category: { type: String },
  requiredStream: { type: mongoose.Schema.Types.ObjectId, ref: 'Stream' },
  requiredExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
  requiredDegrees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }],
  coreSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  certifications: [{ type: String }],
  internshipDuration: { type: String },
  jobRoles: {
    entry: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole' },
    mid: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole' },
    senior: { type: mongoose.Schema.Types.ObjectId, ref: 'JobRole' }
  },
  alternativePaths: [{ type: String }],
  description: { type: String },
  minMarks: { type: Number, default: 50 },
  isHighDemand: { type: Boolean, default: false },
  demandGrowth: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

module.exports = mongoose.model('Career', careerSchema);
