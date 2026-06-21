const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const https = require('https');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const verifyRecaptcha = (token) => {
  return new Promise((resolve, reject) => {
    const data = `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`;
    const req = https.request(
      {
        hostname: 'www.google.com',
        path: '/recaptcha/api/siteverify',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch {
            reject(new Error('Failed to parse reCAPTCHA response'));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

// @desc    Register a new user (with reCAPTCHA)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, captchaToken } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Skip reCAPTCHA in dev mode if secret key is not configured
  const isDev = process.env.NODE_ENV === 'development';
  const recaptchaConfigured = process.env.RECAPTCHA_SECRET_KEY && !process.env.RECAPTCHA_SECRET_KEY.includes('your_');

  if (!isDev || recaptchaConfigured) {
    if (!captchaToken) {
      return res.status(400).json({ message: 'reCAPTCHA verification is required' });
    }

    const recaptchaResult = await verifyRecaptcha(captchaToken);
    if (!recaptchaResult.success) {
      return res.status(403).json({ message: 'Bot activity detected. Registration blocked.' });
    }
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
        message: 'Account created successfully.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    if (error.message && error.message.includes('not primary')) {
      return res.status(500).json({ message: 'Database connection issue. Please try again in a moment.' });
    }
    res.status(500).json({ message: error.message });
  }
};



// @desc    Login user (block unverified)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.password && !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user.id),
      isVerified: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Google token is missing from request body.' });
  }

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Google userinfo returned ${response.status}: ${await response.text()}`);
    }

    const payload = await response.json();
    const { sub: googleId, name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture) user.profilePicture = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture: picture || null,
        password: Math.random().toString(36).slice(-12),
      });
    }

    const appToken = generateToken(user.id);

    return res.status(200).json({
      success: true,
      token: appToken,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    console.error('GOOGLE AUTH ERROR TRACE:', error);
    return res.status(401).json({ success: false, message: 'Google authentication failed internally.', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, profilePicture } = req.body;
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (name !== undefined) {
    user.name = name;
  }
  if (profilePicture !== undefined) {
    user.profilePicture = profilePicture;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    profilePicture: updatedUser.profilePicture,
  });
};

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  updateProfile,
};
