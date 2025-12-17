const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

// Default admin details
const adminUser = {
  name: 'Admin User',
  email: 'admin@akcrrsa.com',
  password: 'password123', // Change this!
  isAdmin: true
};

const seedAdmin = async () => {
  try {
    // You'll paste your atlas URI here just for this script, OR set it in .env
    const MONGO_URI = process.env.MONGO_URI; 

    if (!MONGO_URI) {
        console.error("Please add MONGO_URI to your .env file!");
        process.exit(1);
    }

    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected to Atlas');

    // Check if admin exists
    const userExists = await User.findOne({ email: adminUser.email });

    if (userExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);

    // Create user
    await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      isAdmin: true
    });

    console.log('Admin User Created Successfully!');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${adminUser.password}`);
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
