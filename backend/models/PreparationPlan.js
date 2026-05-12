import mongoose from 'mongoose';

const prepPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  interviewDate: { type: Date },
  resumeText: { type: String, default: '' },
  jdText: { type: String, default: '' },
  analysis: {
    strongSkills: [{ type: String }],
    missingSkills: [{ type: String }],
    dsaLevel: { type: String, default: 'medium' },
    readinessScore: { type: Number, default: 0 },
    interviewRounds: [{ type: String }],
    likelyQuestions: [{ type: String }],
    dailyPlan: [{ day: Number, tasks: [{ type: String }], date: Date }],
    summary: { type: String, default: '' },
  },
}, { timestamps: true });

const PreparationPlan = mongoose.model('PreparationPlan', prepPlanSchema);
export default PreparationPlan;
