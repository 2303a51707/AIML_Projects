const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  summary: {
    type: String,
    required: true,
  },
  missingKeywords: {
    type: [String],
    default: [],
  },
  strengths: {
    type: [String],
    default: [],
  },
  recommendedRevisions: {
    type: [String],
    default: [],
  },
  section_feedback: {
    skills: { type: String, default: '' },
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
