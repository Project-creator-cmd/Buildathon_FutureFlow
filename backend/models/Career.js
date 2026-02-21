const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Engineering & Technology',
      'Medical & Healthcare',
      'Commerce & Finance',
      'Management',
      'Design & Creative',
      'Government & Civil Services',
      'Law',
      'Pure Sciences',
      'Emerging Fields'
    ],
    required: true 
  },
  requiredStream: { type: mongoose.Schema.Types.ObjectId, ref: 'Stream', required: true },
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
});

module.exports = mongoose.model('Career', careerSchema);
