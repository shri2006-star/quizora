require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

const askQuestion = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

async function createAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quizora';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // Arguments from command line: node createAdmin.js [name] [email] [password]
    let name = process.argv[2];
    let email = process.argv[3];
    let password = process.argv[4];

    // If any are missing and running in interactive terminal, prompt user
    if ((!name || !email || !password) && process.stdin.isTTY) {
      console.log('\n--- Create Quizora Admin Account ---');
      if (!name) {
        name = await askQuestion('Enter Admin Name (default: System Admin): ') || 'System Admin';
      }
      if (!email) {
        email = await askQuestion('Enter Admin Email (default: admin@quizora.com): ') || 'admin@quizora.com';
      }
      if (!password) {
        password = await askQuestion('Enter Admin Password (min 6 chars, default: Admin@123): ') || 'Admin@123';
      }
    } else {
      // Non-interactive fallback defaults if not provided in CLI args
      name = name || 'System Admin';
      email = email || 'admin@quizora.com';
      password = password || 'Admin@123';
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    if (password.length < 6) {
      console.error('❌ Error: Password must be at least 6 characters long.');
      process.exit(1);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`ℹ️  User with email '${email}' already exists and is already an Administrator.`);
      } else {
        // Upgrade existing user to admin
        existingUser.role = 'admin';
        existingUser.password = password; // Pre-save hook will hash it
        await existingUser.save();
        console.log(`✅ Existing user '${email}' upgraded to Administrator.`);
      }
    } else {
      // Create new admin user
      const admin = await User.create({
        name,
        email,
        password,
        role: 'admin'
      });
      console.log(`\n🎉 Admin user created successfully!`);
      console.log(`   ID:    ${admin._id}`);
      console.log(`   Name:  ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role:  ${admin.role}\n`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
