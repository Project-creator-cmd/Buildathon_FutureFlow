const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty(),
  body('tenthMarks').isNumeric(),
  body('currentLevel').notEmpty()
], register);

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
