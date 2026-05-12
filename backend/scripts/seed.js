import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/irfan_tracker';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users (optional, but good for a fresh start)
    // await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@cracki.com' });
    if (!adminExists) {
      await User.create({
        name: 'Platform Admin',
        email: 'admin@cracki.com',
        password: hashedPassword,
        role: 'admin',
        college: 'System',
        bio: 'Main administrator for CracKInterview platform.'
      });
      console.log('✅ Admin account created: admin@cracki.com / admin123');
    } else {
      console.log('ℹ️ Admin account already exists.');
    }

    // Create Student
    const studentExists = await User.findOne({ email: 'student@college.edu' });
    if (!studentExists) {
      const studentPass = await bcrypt.hash('student123', salt);
      await User.create({
        name: 'Irfan Khan',
        email: 'student@college.edu',
        password: studentPass,
        role: 'student',
        college: 'RSCOE Pune',
        batch: '2027',
        branch: 'Computer Engineering'
      });
      console.log('✅ Student account created: student@college.edu / student123');
    } else {
      console.log('ℹ️ Student account already exists.');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
}

seed();
