import express from 'express';
import Alumni from '../models/Alumni.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get alumni directory
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { company, college, batch, referral, search } = req.query;
    let query = {};
    if (company) query.company = new RegExp(company, 'i');
    if (college) query.college = new RegExp(college, 'i');
    if (batch) query.batch = batch;
    if (referral === 'true') query.isOpenToReferral = true;
    if (search) query.$text = { $search: search };
    const alumni = await Alumni.find(query).sort({ isOpenToReferral: -1, createdAt: -1 }).limit(100);
    res.json(alumni);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Add alumni profile
router.post('/', authMiddleware, async (req, res) => {
  try {
    const alumnus = await Alumni.create({ ...req.body, user: req.user.id });
    res.json(alumnus);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get alumni by id
router.get('/:id', async (req, res) => {
  try {
    const alumnus = await Alumni.findById(req.params.id);
    if (!alumnus) return res.status(404).json({ error: 'Not found' });
    res.json(alumnus);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Send connection request
router.post('/:id/connect', authMiddleware, async (req, res) => {
  try {
    const alumnus = await Alumni.findById(req.params.id);
    if (!alumnus.connectionRequests.includes(req.user.id)) {
      alumnus.connectionRequests.push(req.user.id);
      await alumnus.save();
    }
    res.json({ requested: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get companies with most alumni (trending)
router.get('/stats/companies', async (req, res) => {
  try {
    const stats = await Alumni.aggregate([
      { $group: { _id: '$company', count: { $sum: 1 }, referrals: { $sum: { $cond: ['$isOpenToReferral', 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
