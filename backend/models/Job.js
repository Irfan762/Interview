import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  description: { type: String, default: '' },
  ctc: { type: String, default: '' },
  stipend: { type: String, default: '' },
  location: { type: String, default: 'Remote' },
  type: { type: String, enum: ['campus', 'offcampus', 'internship', 'hackathon', 'referral'], default: 'offcampus' },
  batchEligibility: [{ type: String }],
  skillsRequired: [{ type: String }],
  lastDate: { type: Date },
  applyLink: { type: String, default: '' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isApproved: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  logo: { type: String, default: '' },
}, { timestamps: true });

jobSchema.index({ company: 'text', role: 'text', skillsRequired: 'text' });
const Job = mongoose.model('Job', jobSchema);
export default Job;
