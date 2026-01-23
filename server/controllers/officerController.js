const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Assuming bcryptjs is used as per other controllers
const asyncHandler = require('express-async-handler');
const Officer = require('../models/Officer');

// Generate JWT for Officer
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

// @desc    Auth officer & get token
// @route   POST /api/officers/login
// @access  Public
const authOfficer = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Login with username instead of email, matching the Officer model
  const officer = await Officer.findOne({ username });

  // Note: Original User.js model comments said "we'll hash before saving".
  // Assuming password in DB is hashed.
  if (officer && (await bcrypt.compare(password, officer.password))) {
    res.json({
      _id: officer.id,
      username: officer.username,
      fullName: officer.fullName,
      woreda: officer.woreda,
      hospitalName:officer.hospitalName,
      role: officer.role,
      token: generateToken(officer._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Register new officer
// @route   POST /api/officers
// @access  Public/Admin? (For now Public to create first user)
const registerOfficer = asyncHandler(async (req, res) => {
  const { fullName, username, phone, password, woreda, role, hospitalName } = req.body;

  if (!fullName || !username || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if officer exists
  const officerExists = await Officer.findOne({ username });

  if (officerExists) {
    res.status(400);
    throw new Error('Officer already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create officer
  const officer = await Officer.create({
    fullName,
    username,
    phone,
    password: hashedPassword,
    woreda,
    role,
    hospitalName
  });

  if (officer) {
    res.status(201).json({
      _id: officer.id,
      username: officer.username,
      fullName: officer.fullName,
      hospitalName: officer.hospitalName,
      token: generateToken(officer._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid officer data');
  }
});

module.exports = {
  authOfficer,
    registerOfficer
};
