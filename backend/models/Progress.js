import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    default: 'irfan_147',
  },
  taskId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique task per user
progressSchema.index({ userId: 1, taskId: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
