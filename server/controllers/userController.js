// server/controllers/userController.js
const User = require('../models/User'); // Import the User Model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Check if all fields exist
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // 2. Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // 3. Hash the password (Encrypt it)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create the user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // 5. Send back the response (User data + Token)
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for user email
  const user = await User.findOne({ email });

  // 2. Check password
  // bcrypt compares the plain text password with the encrypted hash in DB
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
};

// ... (generateToken function is here) ...

// IMPORTANT: Update the export!
module.exports = {
  registerUser,
  loginUser, // <--- Add this
};
// Helper function to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

const addSkill = async (req, res) => {
  const { skill } = req.body;

  // Find user and update
  // $addToSet ensures we don't add duplicates (e.g., "Python" twice)
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { skillsOffered: skill } }, 
    { new: true } // Return the updated user info
  );

  res.status(200).json(user);
};
// ... existing code ...
const getUsers = async (req, res) => {
  // Find all users but HIDE their passwords!
  const users = await User.find({}).select('-password'); 
  res.json(users);
};
// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
const updateLocation = async (req, res) => {
  const { lat, lng } = req.body;

  const user = await User.findById(req.user.id);

  if (user) {
    user.location = { lat, lng };
    await user.save();
    res.json(user); // Send back the updated user
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// DON'T FORGET TO EXPORT!
module.exports = {
  registerUser,
  loginUser,
  addSkill,
  getUsers,
  updateLocation, // <--- Add this
};