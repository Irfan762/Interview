import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ['company_visit', 'interview_exp', 'oa_link', 'aptitude_q', 'hiring', 'referral', 'tip', 'general'],
    default: 'general'
  },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  package: { type: String, default: '' },
  hiringDate: { type: Date },
  eligibility: { type: String, default: '' },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

postSchema.index({ company: 'text', title: 'text', tags: 'text' });
const CommunityPost = mongoose.model('CommunityPost', postSchema);
export default CommunityPost;
