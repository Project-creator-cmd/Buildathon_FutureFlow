const User = require('../models/User');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, tenthMarks, currentLevel, strengths, interests } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, role: 'student' });

    const profile = await Profile.create({
      user: user._id,
      tenthMarks,
      currentLevel,
      strengths: strengths || [],
      interests: interests || []
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
      .populate('bookmarkedCareers');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      user: {
        name: req.user.name,
        email: req.user.email
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    Object.assign(profile, req.body);
    profile.updatedAt = Date.now();
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
