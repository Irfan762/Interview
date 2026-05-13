import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import trackerRoutes from './routes/tracker.js';
import communityRoutes from './routes/community.js';
import jobRoutes from './routes/jobs.js';
import alumniRoutes from './routes/alumni.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// MongoDB
const connectDB = async () => {
  const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, options);
    console.log('✅ MongoDB Atlas connected');
  } catch (err) {
    console.log('⚠️ Atlas connection failed. Trying local MongoDB...');
    try {
      await mongoose.connect('mongodb://localhost:27017/irfan_tracker', options);
      console.log('✅ Local MongoDB connected');
    } catch (localErr) {
      console.error('❌ Database Offline: App running in Demo Mode');
      console.log('💡 Note: Data will not persist and some features might be limited.');
    }
  }
};
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);

app.get('/api/health', (req, res) => res.json({ 
  status: 'ok', 
  database: mongoose.connection.readyState === 1 ? 'connected' : 'offline',
  mode: mongoose.connection.readyState === 1 ? 'production' : 'demo'
}));
app.use('/api/community', communityRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/ai', aiRoutes);


// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../dist', 'index.html')));
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
