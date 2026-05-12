import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  college: { type: String, default: '' },
  category: { type: String, enum: ['college', 'company', 'batch', 'general'], default: 'general' },
  tags: [{ type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  memberCount: { type: Number, default: 1 },
  isPublic: { type: Boolean, default: true },
  avatar: { type: String, default: '' },
  banner: { type: String, default: '' },
}, { timestamps: true });

communitySchema.index({ name: 'text', college: 'text', description: 'text' });
const Community = mongoose.model('Community', communitySchema);
export default Community;
