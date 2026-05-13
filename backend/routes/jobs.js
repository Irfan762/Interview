import express from 'express';
import Job from '../models/Job.js';
import { authMiddleware, optionalAuth, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { type, search, batch, remote, approved } = req.query;
    let query = { isApproved: approved === 'false' ? false : true };
    if (type && type !== 'all') query.type = type;
    if (batch) query.batchEligibility = { $in: [batch] };
    if (remote === 'true') query.location = /remote/i;
    if (search) query.$text = { $search: search };
    const jobs = await Job.find(query).populate('postedBy', 'name').sort({ isFeatured: -1, createdAt: -1 }).limit(100);
    res.json(jobs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Post a job
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Save/unsave job
router.post('/:id/save', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    const saved = job.savedBy.includes(req.user.id);
    if (saved) job.savedBy.pull(req.user.id);
    else job.savedBy.push(req.user.id);
    await job.save();
    res.json({ saved: !saved });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Mark applied
router.post('/:id/apply', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job.applicants.includes(req.user.id)) {
      job.applicants.push(req.user.id);
      await job.save();
    }
    res.json({ applied: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get saved jobs for user
router.get('/user/saved', authMiddleware, async (req, res) => {
  try {
    const jobs = await Job.find({ savedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Admin: approve a job
router.post('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
