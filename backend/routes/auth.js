import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'cracKInterview_secret_2026';
const signToken = (user) => jwt.sign({ id: user._id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, batch, branch, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, college: college || '', batch: batch || '', branch: branch || '', role: role || 'student' });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, batch: user.batch } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check connection status first
    const isConnected = mongoose.connection.readyState === 1;

    // Handle Demo Bypass (Works even if DB is totally dead or still connecting)
    if (email === 'demo@student.com') {
      return res.json({ token: 'demo_token', user: { id: 'demo_s', name: 'Demo Student', email: 'demo@student.com', role: 'student', subscription: 'none' } });
    }
    if (email === 'admin@cracki.com') {
      return res.json({ token: 'demo_token', user: { id: 'demo_a', name: 'Admin User', email: 'admin@cracki.com', role: 'admin' } });
    }

    if (!isConnected) {
      return res.status(503).json({ error: 'Database is offline. Only Demo logins are available at this moment.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, college: user.college, batch: user.batch, branch: user.branch } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
router.put('/profile/:id', async (req, res) => {
  try {
    const { name, college, batch, branch, bio, linkedin, github, skills } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name, college, batch, branch, bio, linkedin, github, skills }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { sendBulkEmail } from '../services/emailService.js';

router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/broadcast', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) return res.status(400).json({ error: 'Subject and message are required' });

    const users = await User.find().select('email');
    const emails = users.map(u => u.email).filter(Boolean);

    if (emails.length === 0) return res.status(400).json({ error: 'No users found with email' });

    const result = await sendBulkEmail(emails, subject, message);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/subscribe', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!['none', 'basic', 'premium'].includes(plan)) return res.status(400).json({ error: 'Invalid plan' });
    
    const user = await User.findByIdAndUpdate(req.user.id, { subscription: plan }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
