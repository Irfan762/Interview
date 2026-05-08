import express from 'express';
import Progress from '../models/Progress.js';

const router = express.Router();

// Get all progress for a user
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ userId });
    
    // Convert to object format { taskId: completed }
    const progressObj = {};
    progress.forEach(p => {
      progressObj[p.taskId] = p.completed;
    });
    
    res.json(progressObj);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle task completion
router.post('/progress/:userId/toggle', async (req, res) => {
  try {
    const { userId } = req.params;
    const { taskId } = req.body;
    
    const existing = await Progress.findOne({ userId, taskId });
    
    if (existing) {
      existing.completed = !existing.completed;
      existing.completedAt = existing.completed ? new Date() : null;
      await existing.save();
      res.json(existing);
    } else {
      const newProgress = await Progress.create({
        userId,
        taskId,
        completed: true,
        completedAt: new Date(),
      });
      res.json(newProgress);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk update progress
router.post('/progress/:userId/bulk', async (req, res) => {
  try {
    const { userId } = req.params;
    const { progressData } = req.body; // { taskId: boolean }
    
    const operations = Object.entries(progressData).map(([taskId, completed]) => ({
      updateOne: {
        filter: { userId, taskId },
        update: {
          $set: {
            completed,
            completedAt: completed ? new Date() : null,
          },
        },
        upsert: true,
      },
    }));
    
    await Progress.bulkWrite(operations);
    res.json({ success: true, updated: operations.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progress.find({ userId });
    
    const total = progress.length;
    const completed = progress.filter(p => p.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    res.json({
      total,
      completed,
      pending: total - completed,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
