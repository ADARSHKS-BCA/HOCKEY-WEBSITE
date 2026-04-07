import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import connectDB from './config/db.js';

const seed = async () => {
  await connectDB();

  // Seed admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@hockeyhub.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
  } else {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      phone: '0000000000',
      password: adminPassword,
      role: 'admin',
      skillLevel: 'pro',
    });
    console.log(`✅ Admin user created: ${adminEmail} / ${adminPassword}`);
  }

  await mongoose.disconnect();
  console.log('Seed complete.');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
