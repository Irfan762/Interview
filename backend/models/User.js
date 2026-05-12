import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin'], default: 'student' },
  college: { type: String, default: '' },
  batch: { type: String, default: '' },
  branch: { type: String, default: '' },
  bio: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  skills: [{ type: String }],
  avatar: { type: String, default: '' },
  lastLogin: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
