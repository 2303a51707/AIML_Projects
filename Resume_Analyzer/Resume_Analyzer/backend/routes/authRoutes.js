const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  googleAuth,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.put('/profile', protect, updateProfile);

module.exports = router;
