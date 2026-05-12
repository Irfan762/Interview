import mongoose from 'mongoose';

const alumniSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  college: { type: String, required: true },
  batch: { type: String, required: true },
  branch: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  email: { type: String, default: '' },
  skills: [{ type: String }],
  city: { type: String, default: '' },
  isOpenToReferral: { type: Boolean, default: false },
  interviewTips: { type: String, default: '' },
  experience: { type: String, default: '' },
  connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

alumniSchema.index({ company: 'text', college: 'text', skills: 'text' });
const Alumni = mongoose.model('Alumni', alumniSchema);
export default Alumni;
